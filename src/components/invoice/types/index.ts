export interface Invoice {
  date: Date;
  description: string;
  facility_id: number;
  customer_id: number;
  items: Array<InvoiceItem>;
}

export interface Item {
  id?: number;
  invoice_number: string;
  amount: number;
  description: string;
  customer: Customer;
  date: string;
  facility_id: number;
  financial_year_id: number;
  customer_id: number;
  received_amount: number;
  invoice_items: Array<InvoiceItem>;
}

export interface Customer {
  id: number;
  name: string;
}

export interface InvoiceItem {
  id?: number;
  amount: number | string;
  invoice_item_definition_id: number | string;
}

export interface FormData {
  date: Date;
  description: string;
  facility_id: number;
  customer_id: number;
  items: Array<InvoiceItem>;
}

export interface ReceiptItem {
  name: string;
  amount: number;
  invoice_item_id: number;
}

export interface InvoiceReceipt {
  id: null;
  amount: number;
  invoice_number: number;
  date: Date;
  description: string;
  customer_id: number;
  customer: Customer;
  bank_account_id: number;
  bank_reference_number: string;
  items: Array<ReceiptItem>;
}

export const newInvoice = (): Invoice => {
  const { amount, invoice_item_definition_id } = newInvoiceItem();
  return {
    date: null,
    description: "",
    facility_id: null,
    customer_id: null,
    items: [{ amount, invoice_item_definition_id }],
  };
};

export const newCustomer = (): Customer => {
  return {
    id: null,
    name: "",
  };
};

export const newInvoiceItem = (): InvoiceItem => {
  return {
    amount: "",
    invoice_item_definition_id: "",
  };
};

export const newFormData = (): FormData => {
  const { amount, invoice_item_definition_id } = newInvoiceItem();
  return {
    date: new Date(),
    description: "",
    facility_id: null,
    customer_id: null,
    items: [{ amount, invoice_item_definition_id }],
  };
};

const newReceipItem = (): ReceiptItem => {
  return {
    name: "",
    amount: null,
    invoice_item_id: null,
  };
};

export const newInvoiceReceipt = (): InvoiceReceipt => {
  const { amount, invoice_item_id } = newReceipItem();
  const { id, name } = newCustomer();
  return {
    id: null,
    amount: null,
    invoice_number: null,
    date: new Date(),
    description: "",
    customer_id: null,
    customer: { id, name },
    bank_account_id: null,
    bank_reference_number: "",
    items: [{ amount, invoice_item_id }],
  };
};
