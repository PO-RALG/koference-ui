import { InvoiceItem } from "./invoice-items";
export interface Invoice {
  invoice_items: InvoiceItem;
  [x: string]: any;
  id: number;
  items: any;
  facility_id: number;
  customer_id: number;
  date: Date;
}
