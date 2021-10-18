import { reactive, onMounted, computed } from "@vue/composition-api";
import { get, create } from "../services/jv-service";
import { get as getAccounts } from "@/components/general-ledger/gl-account/services/gl.account.service";

import { AxiosResponse } from "axios";

import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useState } = createNamespacedHelpers("Auth");

export const useJv = (): any => {
  const { currentUser } = useState(["currentUser"]);

  const HEADERS = [
    {
      text: "ACCOUNT",
      align: "start",
      sortable: false,
      value: "",
      width: "40%",
    },
    {
      text: "DEBIT",
      align: "start",
      sortable: false,
      value: "",
      width: "25%",
    },
    {
      text: "CREDIT",
      align: "center",
      sortable: false,
      value: "",
      width: "25%",
    },

    {
      text: "",
      align: "center",
      sortable: false,
      value: "",
      width: "15%",
    },
  ];

  const data = reactive({
    title: "Manage Journal Vouchers",
    items: [],
    accounts: [],
    modal: false,
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

    getAccounts({ per_page: 200 }).then((response: AxiosResponse) => {
      data.accounts = response.data.data.data;
    });
  };

  const openDialog = () => {
    data.modal = !data.modal;
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
  };
};
