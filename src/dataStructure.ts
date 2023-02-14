export interface Outlet {
  id: number;
  name: string;
  address: string;
  contact: string;
  total_sales: number;
  created_at: Date;
}

export type OutletListType = Outlet[];
export interface Customer {
  id: number;
  name: string;
  address: string;
  gender: "L" | "P";
  contact: string;
  outlet_id: number;
  created_at: Date;
}

export type CustomerListType = Customer[];

export interface Product {
  id: number;
  outlet_id: number;
  type: string;
  name: string;
  price: number;
  created_at: Date;
  outlet_name: string;
}

export type ProductListType = Product[];

export interface Transaction {
  id: number;
  customer_id: number;
  created_at: Date;
  total: number;
  cashier_id: number;
  invoice_code: string;
  outlet_id: number;
  additional_cost: number;
  discount: number;
  taxes: number;
  status: "new" | "on_process" | "finished" | "picked_up";
  is_paid: number;
  deadline: Date;
  paid_at: Date;
  outlet_name: string;
  cashier_name: string;
}

export type TransactionListType = Transaction[];
