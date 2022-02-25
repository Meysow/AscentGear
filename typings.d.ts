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

export interface OrderType {
    _id: string;
    user: UserType;
    orderItems: [
        {
            name: string;
            quantity: number;
            image: string;
            price: number;
        }
    ];
    shippingAddress: {
        name: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
    isPaid?: boolean;
    isDelivered?: boolean;
    paidAt: string;
    deliveredAt: string;
    __v: number;
    createdAt: string;
    updatedAt: string;
}
