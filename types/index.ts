export interface UserStats {
    totalSellers: number;
    totalProducts: number;
    lastActive: number;
}

export interface User {
    id: string;
    name: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
    stats: UserStats;
}

export interface Seller {
    id: string;
    name: string;
    phone: string;
    gstNumber: string;
    shopImage: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Product {
    id: string;
    name: string;
    mrp: number;
    msp: number;
    frontImage: string;
    sideImage: string;
    backImage: string;
    sellerId: string;
    createdAt: Date;
    updatedAt: Date;
}
