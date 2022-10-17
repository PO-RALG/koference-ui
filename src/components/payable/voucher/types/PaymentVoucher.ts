export interface PaymentVoucher {
  id: number;
  date: string;
  supplier_id: number;
  description: string;
  payables: any[];
  approves: any[];
}
export interface Account {
  id: number;
  code: string;
  description: string;
  amount: number;
  allocation: number;
  totalExpenditure: number;
  balance: number;
}

export enum VOUCHER_TYPE {
  "NORMAL" = 1,
  "DEPOSIT" = 3,
  "MMAMA" = 4,
}
export interface Payable {
  gl_account_id: number;
  amount: number;
}
