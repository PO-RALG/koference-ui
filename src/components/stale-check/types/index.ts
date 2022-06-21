import { InvoiceItem } from "./stale-check";
export interface StaleCheque {
  invoice_items: InvoiceItem;
  [x: string]: any;
  id: number;
  items: any;
  facility_id: number;
  customer_id: number;
  date: Date;
}
