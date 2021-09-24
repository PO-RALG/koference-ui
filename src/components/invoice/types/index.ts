import { InvoiceItem } from "./invoice-items";
export interface Invoice {
  id: number;
  items: any;
  facility_id: number;
  invoice_items: InvoiceItem;
  customer_id: number;
  date: Date;
}
