export interface Invoice {
  id?: number;
  items?: InvoiceItem;
  facility_id?: number;
  customer_id?: number;
  description?: string;
  date?: Date;
}

export const newInvoice = (): Invoice => {
  return {
    id: null,
    items: {
      id: null,
      amount: "",
      invoice_item_definition_id: null,
    },
    facility_id: null,
    customer_id: null,
    description: null,
    date: null,
  };
}

export interface Item {
  id?: number;
  invoice_number?: string;
  amount?: number;
  description?: string;
  customer?: Customer;
  date?: Date;
  facility_id?: number;
  financial_year_id?: number;
  customer_id?: number;
  received_amount?: number;
  invoice_items?: Array<InvoiceItem>;
}

export interface Customer {
  id?: number;
  name?: string;
}

export const newCustomer = (): Customer => {
  return {
    id: null,
    name: "",
  };
};

export interface InvoiceItem {
  id?: number;
  amount?: number | string;
  invoice_item_definition_id?: number | string;
}

export const newInvoiceItem = (): InvoiceItem => {
  return {
    id: null,
    amount: null,
    invoice_item_definition_id: null,
  };
};

export interface FormData {
  id?: number;
  date?: Date;
  description?: string;
  facility_id?: number;
  customer_id?: number;
  items?: Array<InvoiceItem>;
}

export const newFormData = (): FormData => {
  return {
    id: null,
    date: null,
    description: "",
    facility_id: null,
    customer_id: null,
    items: [newInvoiceItem()],
  };
};
