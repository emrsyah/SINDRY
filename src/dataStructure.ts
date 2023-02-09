export interface Outlet {
    id: number;
    name: string;
    address: string;
    contact: string;
    created_at: Date;
}

export type OutletListType = Outlet[]
export interface Customer {
    id: number;
    name: string;
    address: string;
    gender: "L" | "P";
    contact: string;
    outlet_id: number;
    created_at: Date;
}

export type CustomerListType = Customer[]