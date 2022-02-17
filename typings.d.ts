export interface ProductType {
    _id: string;
    name: string;
    slug: string;
    category: string;
    image: string;
    price: number;
    brand: string;
    rating: number;
    numReviews: number;
    countInStock: number;
    description: string;
    __v: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductArray {
    products: ProductType[];
}
