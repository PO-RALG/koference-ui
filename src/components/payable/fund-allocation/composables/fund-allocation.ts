import { AxiosResponse } from "axios";
import { reactive, onMounted } from "vue";
import {
  create,
  getBudget,
  statistic,
} from "@/components/payable/fund-allocation/services/fund-allocation.services";
import {
  Budget,
  FundAllocation,
} from "@/components/payable/fund-allocation/types/FundAllocation";
import { FundSources } from "@/components/coa/funding-source/types/index";
import { get as getFundingSource } from "@/components/coa/funding-source/services/funding-sources";

export const useFundAllocation = (): any => {
  const dataItems = [];

  const data = reactive({
    title: "Fund Allocations",
    valid: false,
    response: {},
    items: dataItems,
    searchTerm: "",
    funding_source_id: 0,
    fundingSources: [],
    itemUnallocated: { allocated: 0, totalFund: 0, current: 0, carryover: 0 },
    running_balance: 0,
    allocated: 0,
    headers: [
      {
        text: "GL Account",
        align: "start",
        sortable: false,
        value: "",
      },
      {
        text: "Budget",
        align: "start",
        sortable: false,
        value: "",
      },
      {
        text: "Allocated",
        align: "start",
        sortable: false,
        value: "",
      },
      {
        text: "Expenditure",
        align: "start",
        sortable: false,
        value: "",
      },
      {
        text: "Available",
        align: "start",
        sortable: false,
        value: "",
      },
      {
        text: "Allocate",
        align: "start",
        sortable: false,
        value: "",
      },
    ],
    selectedFund: {} as FundSources,
  });

  onMounted(() => {
    getTableData();
  });
  const removeComma = (data:any)=>{
    const newData = String(data).replace(/[,]/g,'');
    
    return Number(newData);
  }
  const maxAllocation = (budget:any,allocation:any) => {
    if (budget !== null && allocation !== null) {
      const unallocated  = removeComma(budget) - removeComma(allocation)
      return (v: string) =>
        (removeComma(v) !== null && removeComma(v) <= unallocated) ||
        `Amount must be less or equal to ${unallocated}`;
    }
  };

  const maxAvailable = (allocation:any,totalExpenditure:any) => {
    // if (allocation !== null && totalExpenditure !== null) {
    //   const available = removeComma(allocation) - removeComma(totalExpenditure)
    //   return (v: string) =>
    //   (removeComma(v) && removeComma(v) >= available * -1) ||
    //   `Amount must be less or equal to ${available}`;
    // }
  };

  const getTableData = () => {
    getFundingSource({ per_page: 10 }).then((response: AxiosResponse) => {
      data.fundingSources = response.data.data.data;
    });
  };

  const save = () => {
    const linesData = [];
    const budgetItems = data.items;
    for (let i = 0; i < budgetItems.length; i++) {
      const element = {
        account_id: budgetItems[i].id,
        amount: budgetItems[i].allocation_amount,
      };
      linesData.push(element);
    }
    const fundAllocationData = {
      funding_source_id: data.funding_source_id,
      lines: linesData,
    };
    createFundAllocation(fundAllocationData);
  };

  const createFundAllocation = (load: FundAllocation) => {
    create(load).then(() => {
      getBudget({ fund_code: data.selectedFund.code }).then(
        (response: AxiosResponse) => {
          const results = [];
          const responseData = response.data.data;
          for (let i = 0; i < responseData.length; i++) {
            responseData[i].allocation_amount = 0;
            results.push(responseData[i]);
          }
          data.items = results;
        }
      );
    });
  };

  const searchFundingSources = (item: string) => {
    const regSearchTerm = item ? item : data.searchTerm;
    getFundingSource({ per_page: 10, regSearch: regSearchTerm }).then(
      (response: AxiosResponse) => {
        data.fundingSources = response.data.data.data;
      }
    );
  };

  const searchBudgets = (fund: FundSources) => {
    data.funding_source_id = fund.id;
    data.selectedFund = fund;
    getBudget({ fund_code: fund.code }).then((response: AxiosResponse) => {
      const results = [];
      const responseData = response.data.data;
      for (let i = 0; i < responseData.length; i++) {
        responseData[i].allocation_amount = 0;
        results.push(responseData[i]);
      }
      data.items = results;
    });

    statistic(fund.id).then((response: AxiosResponse) => {
      data.itemUnallocated.allocated = parseFloat(response.data.data.allocated);
      data.itemUnallocated.carryover = response.data.data.carryover;
      data.itemUnallocated.current = response.data.data.current;
      data.itemUnallocated.totalFund = response.data.data.totalFund;
      data.allocated = parseFloat(response.data.data.allocated);
      data.running_balance = data.itemUnallocated.totalFund - data.allocated;
    });
  };

  const newAllocation = (amount: number) => {
    if (amount != null) {
      const allocatedArray = data.items;
      const sum_allocated = allocatedArray.reduce((sum: number, b: Budget) => {
        const allocation_amount = b.allocation_amount
          ? parseFloat(b.allocation_amount)
          : 0;
        const allocation = b.allocation ? parseFloat(b.allocation) : 0;
        return sum + allocation_amount + allocation;
      }, 0);
      data.allocated = sum_allocated;
      data.running_balance = data.itemUnallocated.totalFund - data.allocated;
    }
  };

  return {
    data,
    save,
    searchFundingSources,
    searchBudgets,
    newAllocation,
    maxAllocation,
    maxAvailable,
    removeComma,
  };
};
