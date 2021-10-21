export interface Payment {
  id: number;
  date: string;
  bank_account_id: number;
  cheque_type: string;
  cheque: string;
  voucher_id: number;
  description: string;
  items: any[];
}

export interface ItemPlayLoad {
  payable_id: number;
  required_amount: number;
  paid_amount: number;
  amount: number;
  balance: number;
}

