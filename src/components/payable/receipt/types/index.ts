import { ReceiptItem } from "./invoice-items";
export interface Receipt {
  receipt_items: ReceiptItem;
  [x: string]: any;
  id: number;
  items: any;
  facility_id: number;
  customer_id: number;
  date: Date;
}
