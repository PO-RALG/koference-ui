export interface ManageInvoiceItemDefinition {
  id: number;
  name: string;
  code: "string";
  active: boolean;
  unit_of_measure: "string";
  gfs_code_id: number;
  funding_source_id: number;
  facility_id: number;
  description: "string";
}
