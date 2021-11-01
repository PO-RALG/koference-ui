import { BackAccount } from "@/components/setup/bank-account/types/BackAccount";
import { Facility } from "@/components/facility/facility/types/Facility";
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

interface Council{
  id: number;
  name: string;
}
export interface PaymentPreview {
  id: number;
  amount: number;
  cheque: string;
  bank_account:BackAccount;
  concil:Council;
  facility:Facility;
  printDate:Date;
}

