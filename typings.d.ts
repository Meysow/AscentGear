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
    createdAt: string;
    updatedAt: string;
}

export interface ProductArray {
    products: ProductType[];
}
