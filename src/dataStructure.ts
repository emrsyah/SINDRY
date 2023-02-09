export interface Outlet {
    id: number;
    name: string;
    address: string;
    contact: string;
    created_at: Date;
}

export type OutletListType = Outlet[]