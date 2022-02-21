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
    quantity: number;
}

export interface ProductArray {
    products: ProductType[];
}

export interface UserType {
    _id: string;
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    __v: number;
    createdAt: string;
    updatedAt: string;
}

export interface UserArray {
    users: UserType[];
}
