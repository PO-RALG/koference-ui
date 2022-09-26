import { Item } from "./items";
export interface BankAdjustmentPayload {
  items: Item[];
  facility_id: number;
  date: Date;
  description:string,
  bank_account_id: number
}
export interface BankAdjustment {
  id: number;
  date: Date;
  description:string,
  bank_account: number,
  amount:number
}
