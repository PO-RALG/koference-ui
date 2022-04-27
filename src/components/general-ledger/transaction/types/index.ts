export interface Entry {
  id?: number;
  apply_date: Date;
  description?: string;
  reference: string;
  total: number;
  gl_entries: Array<GLTransaction>;
}

export interface GLTransaction {
  id?: number;
  description?: string;
  account: string;
  cr_amount: number;
  dr_amount: number;
}

export const newGLTransaction = (): GLTransaction => {
  return {
    id: null,
    description: "",
    account: "",
    cr_amount: 0,
    dr_amount: 0,
  };
};

export const newEntry = (): Entry => {
  return {
    id: null,
    apply_date: new Date(),
    description: "",
    reference: "",
    total: 0,
    gl_entries: [newGLTransaction()],
  };
};
