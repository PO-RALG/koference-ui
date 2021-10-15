export interface Payment {
  id: number;
  date: string;
  supplier_id: number;
  description: string;
  payables: any[];
}
