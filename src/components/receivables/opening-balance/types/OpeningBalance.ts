import { Item } from "./items";
export interface OpeningBalancePayload {
  items: Item[];
  facility_id: number;
  date: Date;
  description:string,
  bank_account_id: number
}
export interface OpeningBalance {
  id: number;
  date: Date;
  description:string,
  bank_account: number,
  amount:number
}
