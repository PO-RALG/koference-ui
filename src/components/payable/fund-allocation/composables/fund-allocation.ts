import { AxiosResponse } from "axios";
import { reactive, onMounted } from "@vue/composition-api";
import {
  create,
  getBudget,
  statistic,
} from "@/components/payable/fund-allocation/services/fund-allocation.service";
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
  });

  onMounted(() => {
    getTableData();
  });

  const maxRules = (propertyType: number) => {
    return (v: number) =>
      (v && v <= propertyType) ||
      `Amount must be less or equal to ${propertyType}`;
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
      window.location.reload();
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
    getBudget({ fund_code: fund.code }).then((response: AxiosResponse) => {
      data.items = response.data.data;
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
    maxRules,
  };
};
