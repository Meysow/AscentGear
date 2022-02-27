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
export interface OrderTypes {
    shippingAddress: ShippingAddress<T>;
    _id: string;
    user: string;
    orderItems: OrderItem[];
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
    isPaid: boolean;
    isDelivered: boolean;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export interface OrderItem {
    name: string;
    quantity: number;
    image: string;
    price: number;
    _id: string;
}

export interface ShippingAddress {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface Cart {
    cartItems: ProductType[];
    shippingAddress: ShippingAddress<T>;
    paymentMethod: string;
}

export interface UserInfo {
    name: string;
    email: string;
    password: any;
    token: any;
}

export interface OrderTypesTwo {
    shippingAddress: ShippingAddress<T>;
    _id: string;
    user: string;
    orderItems: OrderItem[];
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
    isPaid: boolean;
    isDelivered: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    paidAt: string;
    deliveredAt: string;
}
