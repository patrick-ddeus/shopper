export type ApplicationError = {
  name: string;
  message: string;
};

export type ProductDB = {
  code: number;
  name: string;
  cost_price: number;
  sales_price: number;
};

export type ProductsFromRequest = {
  code: string;
  new_price: string;
};

export type TableProduct = {
  name: string;
  code: string;
  old_price: number | string;
  new_price: number | string;
  error: string;
};
