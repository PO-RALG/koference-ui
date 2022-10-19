import { reactive, onMounted, set, ref, computed } from "@vue/composition-api";
import { AxiosResponse } from "axios";

import store from "@/store";
import { get, printPdf } from "../services/gl-report-services";
import { get as getFinancialYears } from "@/components/setup/financial-year/services/financialyear.service";
import { get as getGfsCodes } from "@/components/coa/gfs-code/service/gfs.service";
import moment from "moment";

export const useGLReport = (): any => {
  const dTable = ref(null);

  const params = reactive({
    from_gfs: null,
    to_gfs: null,
    financial_year: null,
    start_date: null,
    end_date: null,
    financial_year_id: null,
    print_type: null,
  });

  const data = reactive({
    entries: [],
    title: "General Ledger Report",
    showDateSelection: false,
    facility: null,
    financialYears: [],
    gfsCodes: [],
    modal: false,
    minDate: null,
    maxDate: null,
    currentDate: null,
    dateRules: [
      (v: any) => !!v || "Email is required",
      (v: any) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        "E-mail must be a valid email",
    ],
  });

  const openPrintDialog = () => {
    params.print_type = "pdf";
    delete params.financial_year;
    printPdf(params);
  };

  const openDialog = () => {
    data.modal = !data.modal;
  };

  const closeDialog = () => {
    data.modal = !data.modal;
  };

  onMounted(() => {
    init();
    //set(dTable.value.expanded, "expanded", data.entries);
    for (let i = 0; i < data.entries.length; i += 1) {
      const item = data.entries[i];
      set(dTable.expanded, item.name, true);
    }
    data.currentDate = moment(new Date()).format("YYYY-MM-DD");
  });

  const init = (params?: any) => {
    if (params) {
      delete params.financial_year;
      get(params).then((response: AxiosResponse) => {
        data.facility = response.data.data.facility;
        data.entries = response.data.data.data;
      });
    } else {
      get().then((response: AxiosResponse) => {
        data.facility = response.data.data.facility;
        data.entries = response.data.data.data;
      });
    }

    getFinancialYears({}).then((response) => {
      data.financialYears = response.data.data.data;
    });

    const gfsParams = {
      asc: "code",
    };

    getGfsCodes(gfsParams).then((response) => {
      data.gfsCodes = response.data.data.data;
    });
  };

  const facility = computed(() => {
    return data.facility;
  });

  const entries = computed(() => {
    return data.entries.map((entry: any) => ({
      ...entry,
    }));
  });

  const getName = (transaction: any) => {
    if (transaction.ledgerable) {
      return transaction.ledgerable.name
        ? transaction.ledgerable.name
        : transaction.ledgerable.descriptions;
    } else {
      return "No Description Available ";
    }
  };

  const gfsCodes = computed(() => {
    return data.gfsCodes.map((gfs) => {
      return {
        id: gfs.id,
        name: `(${gfs.code}) - ${gfs.name}`,
        code: gfs.code,
      };
    });
  });

  const showDateSelection = () => {
    const fyStartDate = moment(params.financial_year.start_date).format(
      "YYYY-MM-DD"
    );
    const fyEndDate = moment(params.financial_year.end_date).format(
      "YYYY-MM-DD"
    );

    data.maxDate = moment(fyEndDate).isBefore(moment(data.currentDate))
      ? fyEndDate
      : data.currentDate;
    data.minDate = fyStartDate;
    data.showDateSelection = true;
  };

  const filterReport = () => {
    delete params.print_type;
    params.financial_year_id = params.financial_year.id;
    init(params);
    closeDialog();
  };

  return {
    data,
    facility,
    dTable,
    openPrintDialog,
    params,
    showDateSelection,
    openDialog,
    closeDialog,
    filterReport,
    gfsCodes,
    entries,
    getName,
  };
};
