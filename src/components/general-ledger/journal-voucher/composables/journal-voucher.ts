import { reactive, onMounted, computed } from "@vue/composition-api";
import { get, create } from "../services/jv-service";
import { glAccount as getGLAccounts } from "@/components/receivables/invoice-item-definition/services/invoice-item-definition";
import { get as getFundingSources } from "@/components/coa/funding-source/services/funding-sources";
import { AxiosResponse } from "axios";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useState } = createNamespacedHelpers("Auth");
import moment from "moment";

export const useJv = (): any => {
  const { currentUser } = useState(["currentUser"]);

  const HEADERS = [
    {
      text: "FUND SOURCE",
      align: "start",
      sortable: false,
      value: "",
      width: "25%",
    },
    {
      text: "ACCOUNT",
      align: "start",
      sortable: false,
      value: "",
      width: "25%",
    },
    {
      text: "DEBIT",
      align: "start",
      sortable: false,
      value: "",
      width: "20%",
    },
    {
      text: "CREDIT",
      align: "center",
      sortable: false,
      value: "",
      width: "20%",
    },

    {
      text: "",
      align: "center",
      sortable: false,
      value: "",
      width: "10%",
    },
  ];

  const data = reactive({
    title: "Manage Journal Vouchers",
    items: [],
    accounts: [],
    gl_accounts: [],
    fundingSources: [],
    modal: false,
    maxDate: moment(new Date()).format("YYYY-MM-DD"),
    params: {},
    response: {
      total: 100,
      size: 10,
    },
    currentUser: null,
    jv: {
      date: null,
      descriptions: null,
      facility_id: null,
      lines: [
        {
          account: "",
          dr_amount: 0,
          cr_amount: 0,
          funding_source_code: "",
        },
      ],
    },
  });

  onMounted(() => {
    init();
  });

  const init = () => {
    data.currentUser = currentUser;
    get({}).then((response: AxiosResponse) => {
      data.items = response.data.data.data;
    });

    getGLAccounts({ per_page: 200 }).then((response: AxiosResponse) => {
      data.accounts = response.data.data.data;
    });
  };

  const openDialog = () => {
    data.modal = !data.modal;
    getFundingSources({ per_page: 2000 }).then((response: AxiosResponse) => {
      data.fundingSources = response.data.data.data;
    });
  };

  const getData = (params: any) => {
    data.response = params;
    get(params).then((response: AxiosResponse) => {
      data.response = response.data.data;
      data.items = response.data.data.data;
    });
  };

  const cancelDialog = () => {
    data.modal = !data.modal;
  };

  const addRow = () => {
    data.jv.lines.push({
      account: "",
      dr_amount: 0,
      cr_amount: 0,
      funding_source_code: "",
    });
  };

  const removeRow = (index: number) => {
    data.jv.lines.splice(index, 1);
  };

  const save = () => {
    data.jv.facility_id = data.currentUser.facility_id;
    create(data.jv).then((response: AxiosResponse) => {
      if (response.status === 200) {
        data.modal = !data.modal;
      }
    });
  };

  const accounts = computed(() => {
    return data.accounts;
  });

  const checkDrAmount = (index: number) => {
    if (data.jv.lines[index]["dr_amount"] === 0) {
      return;
    } else {
      data.jv.lines[index]["cr_amount"] = 0;
    }
  };

  const checkCrAmount = (index: number) => {
    if (data.jv.lines[index]["cr_amount"] === 0) {
      return;
    } else {
      data.jv.lines[index]["dr_amount"] = 0;
    }
  };

  const refillAccounts = (entry) => {
    data.accounts = data.accounts.map((item) => {
      if (item.code === entry) {
        item.disabled = true;
        return {
          ...item,
        };
      }
    });
  };

  const getDebitBalance = (lines: Array<any>) => {
    return lines.reduce((acc, line) => acc + line.dr_amount, 0);
  };

  const getCreditBalance = (lines: Array<any>) => {
    return lines.reduce((acc, line) => acc + line.cr_amount, 0);
  };

  const total = (lines: Array<any>, TYPE: string) => {
    switch (TYPE) {
      case "DR":
        return getDebitBalance(lines);
      case "CR":
        return getCreditBalance(lines);
    }
  };

  const loadGLAccounts = async (fundSourceCode, index) => {
    const params = {
      per_page: 10,
      fund_code: fundSourceCode,
    };

    getGLAccounts(params).then((response: AxiosResponse) => {
      if (response.data.data.data.length > 0) {
        data.gl_accounts.push(response.data.data.data);
      }
    });
  };

  return {
    data,
    accounts,
    HEADERS,
    openDialog,
    getData,
    cancelDialog,
    save,
    addRow,
    removeRow,
    currentUser,
    checkCrAmount,
    checkDrAmount,
    refillAccounts,
    total,
    loadGLAccounts,
  };
};
