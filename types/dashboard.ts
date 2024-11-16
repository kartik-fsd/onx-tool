import { Product, Seller, User } from ".";



export interface DashboardStats {
    totalSellers: number;
    totalProducts: number;
    averageProductsPerSeller: number;
}

export interface SellerWithProducts extends Seller {
    products: Product[];
    user: User;
}

export interface ProductWithImages {
    id: string;
    name: string;
    mrp: number;
    msp: number;
    frontImage: string;
    sideImage: string;
    backImage: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface FilterOptions {
    dateRange?: 'today' | 'week' | 'month' | 'all';
    sortBy?: 'date' | 'products' | 'name';
    sortOrder?: 'asc' | 'desc';
}

export interface DashboardContext {
    stats: DashboardStats;
    sellers: SellerWithProducts[];
    isLoading: boolean;
    filters: FilterOptions;
    setFilters: (filters: FilterOptions) => void;
    refreshData: () => Promise<void>;
}
export interface DashboardStats {
    totalSellers: number;
    totalProducts: number;
    averageProductsPerSeller: number;
}

export interface ProductData {
    id: string;
    name: string;
    mrp: number;
    msp: number;
    frontImage: string;
    sideImage: string;
    backImage: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserData {
    id: string;
    name: string;
    phone: string;
}

export interface SellerData extends Omit<Seller, 'products' | 'user'> {
    products: ProductData[];
    user: UserData;
}

export interface FilterOptions {
    dateRange?: 'today' | 'week' | 'month' | 'all';
    sortBy?: 'date' | 'products' | 'name';
    sortOrder?: 'asc' | 'desc';
}
