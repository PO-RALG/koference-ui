import { Activity } from "../../activity/types/Activity";

export interface ActivityCosting {
  id: number;
  amount: string;
  account:string;
  account_id: string;
  facility_id: number;
  planrep_batch_no: string;
  activity: Activity
}
