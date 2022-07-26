import { reactive, onMounted, set, ref, computed } from "@vue/composition-api";
import { AxiosResponse } from "axios";

import store from "@/store";
import { get, printPdf } from "../services/cashbook-report-services";
import { get as getFinancialYears } from "@/components/setup/financial-year/services/financialyear.service";
import moment from "moment";
import {bankaccounts} from "@/components/setup/bank-account/services/bank-account.service";

export const useCashbookReport = (): any => {
  const dTable = ref(null);

  const params = reactive({
    start_date: null,
    end_date: null,
    financial_year_id: null,
    print_type: null,
    bank_account_id:null,
    financial_year:null
  });

  const data = reactive({
    entries: [],
    title: "Cash Book Report",
    showDateSelection: false,
    facility: null,
    financialYears: [],
    bankAccount: {},
    modal: false,
    minDate: null,
    maxDate: null,
    currentDate: null,
    bankAccounts: []
  });

  const openPrintDialog = () => {
    params.print_type = "pdf";
    delete params.financial_year;
    Object.keys(params).forEach(key => {
      if (params[key] === null) {
        delete params[key];
      }
    });
    console.log(params);
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
    getFinancialYears({}).then((response) => {
      data.financialYears = response.data.data.data;
    });
    bankaccounts({}).then((response) => {
      data.bankAccounts = response.data.data.data;
    });
  }
  const loadData = (params?: any) => {
    if (params !== null) {

      delete params.financial_year;
      Object.keys(params).forEach(key => {
        if (params[key] === null) {
          delete params[key];
        }
      });

      get(params).then((response: AxiosResponse) => {
        data.facility = response.data.data.facility;
        data.entries = response.data.data.data;
      });
    } else {
      getFinancialYears({}).then((response) => {
        data.financialYears = response.data.data.data;
      });
      bankaccounts({}).then((response) => {
        data.bankAccounts = response.data.data.data;
      });
    }

  };

  const facility = computed(() => {
    return data.facility;
  });

  const entries = computed(() => {
    return data.entries.map((entry: any) => ({
      ...entry,
    }));
  });


  const showDateSelection = () => {
    const fyStartDate = moment(params.financial_year.start_date).format("YYYY-MM-DD");
    const fyEndDate = moment(params.financial_year.end_date).format("YYYY-MM-DD");

    data.maxDate = moment(fyEndDate).isBefore(moment(data.currentDate)) ? fyEndDate : data.currentDate;
    data.minDate = fyStartDate;
    data.showDateSelection = true;
  };

  const filterReport = () => {
    delete params.print_type;
    params.financial_year_id = params.financial_year.id;
    loadData(params);
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
    entries
  };
};
