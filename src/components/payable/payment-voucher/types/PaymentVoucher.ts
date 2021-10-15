export interface PaymentVoucher {
  id: number;
  date: string;
  supplier_id: number;
  description: string;
  payables: any[];
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
