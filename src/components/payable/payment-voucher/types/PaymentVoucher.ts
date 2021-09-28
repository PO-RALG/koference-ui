export interface PaymentVoucher {
  id: number;
  date: Date;
  supplier_id: number;
  bank_account_id: number;
  financial_year_id: number;
  reference_no: string;
  amount: number;
  amount_paid: number;
  description: string;
  annual_serial: string;
  full_paid: boolean;
}
