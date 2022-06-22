import { InvoiceItem } from "./stale-check";
export interface StaleCheque {
  invoice_items: InvoiceItem;
  id: number;
  payment_id: number;
  start_cheque: string;
  amount: number;
  financial_year_id: number;
  facility_id: number;
  new_cheque: string;
  repayment_date: Date;
}
