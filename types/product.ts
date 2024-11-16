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

export interface ProductFormData {
    name: string;
    mrp: number;
    msp: number;
    frontImage: FileList;
    sideImage: FileList;
    backImage: FileList;
}