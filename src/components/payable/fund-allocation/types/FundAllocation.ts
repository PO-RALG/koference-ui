export interface FundAllocation {
  id: number;
  amount: string;
  activity_id: number;
  funding_source_id: number;
  allocation_amount: number;
  facility_id: number;
}

export interface Budget {
  id: number;
  amount: string;
  activity_id: number;
  funding_source_id: number;
  allocation_amount: string;
  facility_id: number;
  total_allocated: string;
  activity: string;
}