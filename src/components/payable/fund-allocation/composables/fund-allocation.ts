import { AxiosResponse } from "axios";
import { reactive, onMounted } from "@vue/composition-api";
import { create } from "@/components/payable/fund-allocation/services/fund-allocation.service";
import { Budget } from "@/components/payable/fund-allocation/types/FundAllocation"
import { get as getFundingSource } from "@/components/coa/funding-source/services/funding-sources"

export const useFundAllocation = (): any =>{
  let dataItems = {lines:[]};

  let data = reactive({
    title: "Fund Allocations",
    valid: true,
    response: {},
    items: dataItems,
    searchTerm: "",
    funding_source_id:"",
    fundingSources:[],
    itemUnallocated:{allocated: 0,total: 0,current: 0,carryover: 0 },
    running_balance:0,
    allocated:0,
  });

  onMounted(() => {
    getTableData();
  });
  

  const getTableData = () => {
    getFundingSource({ per_page: 10 }).then((response: AxiosResponse) => {
      data.fundingSources = response.data.data.data;
    });
  };

  const save = () => {
    createFundAllocation(data.items);
  };

  const createFundAllocation = (data) => {
    create(data).then(() => {
      getTableData();
    });
  };

  const searchFundingSources = (item: string) => {
    let regSearchTerm = item ? item : data.searchTerm;
    getFundingSource({ per_page: 10, regSearch: regSearchTerm }).then((response: AxiosResponse) => {
      data.fundingSources = response.data.data.data;
    });
  };

  const searchBudgets = (id:string) => {
    if (id != null) {
      let fundbudgetData = {
        "data":{
            "funding_source_id": "24",
            "lines":[
              {
                  "amount":  "1731600",
                  "activity_id": 1521783,
                  "gfs_code_id": 182,
                  "funding_source_id": 24,
                  "gl": "086-2005-03106-509B-0000000-S0003809-201-4393-CS4-CS4475-2-00000-20J-22013111",
                  "facility_id": 18998,
                  "financial_year_id": 6,
                  "fund_type_id": 1,
                  "created_at": "2021-08-07 11:25:45",
                  "updated_at": "2021-08-07 11:25:45",
                  "deleted_at": null,
                  "allocation": null,
                  "expenditure": "151740",
                  "muse_gl": null,
                  "id": 1148300,
                  "budget_category": "BA",
                  "activity": "To facilitate schools fees compensation to all 15 secondary schools by June 2024",
                  "gfs": "Examination Expenses",
                  "total_allocated": "216400",
                  "allocation_amount": 0,
                  "isValid": true
              },
              {
                  "amount": "268158.24",
                  "activity_id": 1521783,
                  "gfs_code_id": 113,
                  "funding_source_id": 24,
                  "gl": "086-2005-03106-509B-0000000-S0003809-201-4393-CS4-CS4475-2-00000-20J-22004110",
                  "facility_id": 18998,
                  "financial_year_id": 6,
                  "fund_type_id": 1,
                  "created_at": "2021-08-07 11:25:45",
                  "updated_at": "2021-08-07 11:25:45",
                  "deleted_at": null,
                  "allocation": null,
                  "expenditure": 0,
                  "muse_gl": null,
                  "id": 1148301,
                  "budget_category": "BA",
                  "activity": "To facilitate schools fees compensation to all 15 secondary schools by June 2024",
                  "gfs": "Consumable Medical Supplies",
                  "total_allocated": 0,
                  "allocation_amount": 0,
                  "isValid": true
              },
              {
                  "amount": "799200",
                  "activity_id": 1521783,
                  "gfs_code_id": 80,
                  "funding_source_id": 24,
                  "gl": "086-2005-03106-509B-0000000-S0003809-201-4393-CS4-CS4475-2-00000-20J-22001101",
                  "facility_id": 18998,
                  "financial_year_id": 6,
                  "fund_type_id": 1,
                  "created_at": "2021-08-07 11:25:45",
                  "updated_at": "2021-08-07 11:25:45",
                  "deleted_at": null,
                  "allocation": null,
                  "expenditure": 0,
                  "muse_gl": null,
                  "id": 1148302,
                  "budget_category": "BA",
                  "activity": "To facilitate schools fees compensation to all 15 secondary schools by June 2024",
                  "gfs": "Office Consumables (papers,pencils, pens and stationaries)",
                  "total_allocated": 0,
                  "allocation_amount": 0,
                  "isValid": true
              },
              {
                  "amount": "777000",
                  "activity_id": 1521783,
                  "gfs_code_id": 89,
                  "funding_source_id": 24,
                  "gl": "086-2005-03106-509B-0000000-S0003809-201-4393-CS4-CS4475-2-00000-20J-22001112",
                  "facility_id": 18998,
                  "financial_year_id": 6,
                  "fund_type_id": 1,
                  "created_at": "2021-08-07 11:25:45",
                  "updated_at": "2021-08-07 11:25:45",
                  "deleted_at": null,
                  "allocation": null,
                  "expenditure": "200000",
                  "muse_gl": null,
                  "id": 1148303,
                  "budget_category": "BA",
                  "activity": "To facilitate schools fees compensation to all 15 secondary schools by June 2024",
                  "gfs": "Outsourcing Costs (includes cleaning and security services)",
                  "total_allocated": "200000",
                  "allocation_amount": 0,
                  "isValid": true
              },
              {
                  "amount": "393000",
                  "activity_id": 1521783,
                  "gfs_code_id": 324,
                  "funding_source_id": 24,
                  "gl": "086-2005-03106-509B-0000000-S0003809-201-4393-CS4-CS4475-2-00000-20J-22001114",
                  "facility_id": 18998,
                  "financial_year_id": 6,
                  "fund_type_id": 1,
                  "created_at": "2021-08-07 11:25:45",
                  "updated_at": "2021-08-07 11:25:45",
                  "deleted_at": null,
                  "allocation": null,
                  "expenditure": 0,
                  "muse_gl": null,
                  "id": 1148304,
                  "budget_category": "BA",
                  "activity": "To facilitate schools fees compensation to all 15 secondary schools by June 2024",
                  "gfs": "Other Administration Expense",
                  "total_allocated": 0,
                  "allocation_amount": 0,
                  "isValid": true
              },
              {
                  "amount": "450000",
                  "activity_id": 1521783,
                  "gfs_code_id": 40,
                  "funding_source_id": 24,
                  "gl": "086-2005-03106-509B-0000000-S0003809-201-4393-CS4-CS4475-2-00000-20J-21113103",
                  "facility_id": 18998,
                  "financial_year_id": 6,
                  "fund_type_id": 1,
                  "created_at": "2021-08-07 11:25:45",
                  "updated_at": "2021-08-07 11:25:45",
                  "deleted_at": null,
                  "allocation": null,
                  "expenditure": "95600",
                  "muse_gl": null,
                  "id": 1148305,
                  "budget_category": "BA",
                  "activity": "To facilitate schools fees compensation to all 15 secondary schools by June 2024",
                  "gfs": "Extra-Duty",
                  "total_allocated": "96400",
                  "allocation_amount": 0,
                  "isValid": true
              },
              {
                  "amount": "659015.76",
                  "activity_id": 1521783,
                  "gfs_code_id": 262,
                  "funding_source_id": 24,
                  "gl": "086-2005-03106-509B-0000000-S0003809-201-4393-CS4-CS4475-2-00000-20J-22024106",
                  "facility_id": 18998,
                  "financial_year_id": 6,
                  "fund_type_id": 1,
                  "created_at": "2021-08-07 11:25:45",
                  "updated_at": "2021-08-07 11:25:45",
                  "deleted_at": null,
                  "allocation": null,
                  "expenditure": 0,
                  "muse_gl": null,
                  "id": 1148306,
                  "budget_category": "BA",
                  "activity": "To facilitate schools fees compensation to all 15 secondary schools by June 2024",
                  "gfs": "Outsource maintenance contract services",
                  "total_allocated": 0,
                  "allocation_amount": 0,
                  "isValid": true
              },
              {
                  "amount": "650000",
                  "activity_id": 1521783,
                  "gfs_code_id": 922,
                  "funding_source_id": 24,
                  "gl": "086-2005-03106-509B-0000000-S0003809-201-4393-CS4-CS4475-2-00000-20J-31113114",
                  "facility_id": 18998,
                  "financial_year_id": 6,
                  "fund_type_id": 1,
                  "created_at": "2021-08-07 11:25:45",
                  "updated_at": "2021-08-07 11:25:45",
                  "deleted_at": null,
                  "allocation": null,
                  "expenditure": 0,
                  "muse_gl": null,
                  "id": 1148307,
                  "budget_category": "BA",
                  "activity": "To facilitate schools fees compensation to all 15 secondary schools by June 2024",
                  "gfs": "Outdoor sports and recreational facilities",
                  "total_allocated": 0,
                  "allocation_amount": 0,
                  "isValid": true
              },
              {
                  "amount": "70000",
                  "activity_id": 1521783,
                  "gfs_code_id": 91,
                  "funding_source_id": 24,
                  "gl": "086-2005-03106-509B-0000000-S0003809-201-4393-CS4-CS4475-2-00000-20J-22002101",
                  "facility_id": 18998,
                  "financial_year_id": 6,
                  "fund_type_id": 1,
                  "created_at": "2021-08-07 11:25:45",
                  "updated_at": "2021-08-07 11:25:45",
                  "deleted_at": null,
                  "allocation": null,
                  "expenditure": "20000",
                  "muse_gl": null,
                  "id": 1148308,
                  "budget_category": "BA",
                  "activity": "To facilitate schools fees compensation to all 15 secondary schools by June 2024",
                  "gfs": "Electricity",
                  "total_allocated": "20000",
                  "allocation_amount": 0,
                  "isValid": true
              },
              {
                  "amount": "287100",
                  "activity_id": 1743748,
                  "gfs_code_id": 148,
                  "funding_source_id": 24,
                  "gl": "086-2005-03106-509B-0000000-S0003809-201-4393-CS7-CS7443-7-00000-20J-22010105",
                  "facility_id": 18998,
                  "financial_year_id": 6,
                  "fund_type_id": 1,
                  "created_at": "2021-09-07 10:17:14",
                  "updated_at": "2021-09-07 10:17:14",
                  "deleted_at": null,
                  "allocation": null,
                  "expenditure": 0,
                  "muse_gl": null,
                  "id": 1339412,
                  "budget_category": "CF",
                  "activity": "To facilitate Distribution of schools fees compensation  to secondary schools by September 2021",
                  "gfs": "Per Diem - Domestic",
                  "total_allocated": 0,
                  "allocation_amount": 0,
                  "isValid": true
              },
              {
                  "amount": "350000",
                  "activity_id": 1743748,
                  "gfs_code_id": 80,
                  "funding_source_id": 24,
                  "gl": "086-2005-03106-509B-0000000-S0003809-201-4393-CS7-CS7443-7-00000-20J-22001101",
                  "facility_id": 18998,
                  "financial_year_id": 6,
                  "fund_type_id": 1,
                  "created_at": "2021-09-07 10:17:14",
                  "updated_at": "2021-09-07 10:17:14",
                  "deleted_at": null,
                  "allocation": null,
                  "expenditure": 0,
                  "muse_gl": null,
                  "id": 1339413,
                  "budget_category": "CF",
                  "activity": "To facilitate Distribution of schools fees compensation  to secondary schools by September 2021",
                  "gfs": "Office Consumables (papers,pencils, pens and stationaries)",
                  "total_allocated": 0,
                  "allocation_amount": 0,
                  "isValid": true
              }
            ],
            "total_budget":6435074
        },
        "message":"success",
        "errors":"",
        "status":200
      };
      
      let unallocatedData = {
        "data":{
            "unallocated":637100,
            "total":1169900,
            "allocated":532800,
            "current":532800,
            "carryover":637100,
            "fund_status":false
        },
        "message":"ok",
        "errors":"",
        "status":200
      };

      data.items = fundbudgetData.data;
      data.itemUnallocated = unallocatedData.data;
      data.allocated = data.itemUnallocated.allocated;
      data.running_balance = data.itemUnallocated.total - data.allocated;

      // search({ name: id.name }).then((response: AxiosResponse) => {
      //   data.items = response.data.data.data;
      // });
    }
  };

  const newAllocation = (amount: number) => {
    if (amount != null) {
      const allocatedArray = data.items.lines;
      const sum_allocated = allocatedArray.reduce((sum: number, b: Budget) => {
        const allocation_amount = b.allocation_amount
          ? parseFloat(b.allocation_amount)
          : 0;
        return sum + allocation_amount;
      }, 0);
      data.allocated = data.itemUnallocated.allocated + sum_allocated;
      data.running_balance = data.itemUnallocated.total - data.allocated;
    }
  };

  return {
    data,
    save,
    searchFundingSources,
    searchBudgets,
    newAllocation,
  };
};
