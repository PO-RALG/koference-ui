export interface PaymentVoucher {
  id: number;
  date: string;
  supplier_id: number;
  description: string;
  payables: any[];
}
