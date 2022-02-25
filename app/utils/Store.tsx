import { createContext, useReducer } from 'react';
import Cookies from 'js-cookie';
import { ProductType } from '../../typings';

interface InitialStateType {
    darkMode: boolean;
    cart: any;
    userInfo: any;
}

export enum ActionType {
    DARK_MODE_ON,
    DARK_MODE_OFF,
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    USER_LOGIN,
    USER_LOGOUT,
    SAVE_SHIPPING_ADDRESS,
    SAVE_PAYMENT_METHOD,
    CART_CLEAR,
}

interface IAction {
    type: ActionType;
    payload?: unknown;
}

const initialState = {
    darkMode: Cookies.get('darkMode') === 'ON' ? true : false,
    cart: {
        cartItems: Cookies.get('cartItems')
            ? JSON.parse(Cookies.get('cartItems')!)
            : [],
        shippingAddress: Cookies.get('shippingAddress')
            ? JSON.parse(Cookies.get('shippingAddress')!)
            : {},
        paymentMethod: Cookies.get('paymentMethod')
            ? JSON.parse(Cookies.get('paymentMethod')!)
            : '',
    },
    userInfo: Cookies.get('userInfo')
        ? JSON.parse(Cookies.get('userInfo')!)
        : null,
};

export const Store = createContext<{
    state: InitialStateType;
    dispatch: React.Dispatch<any>;
}>({
    state: initialState,
    dispatch: () => null,
});

function reducer(state: InitialStateType, action: IAction) {
    switch (action.type) {
        case ActionType.DARK_MODE_ON:
            return { ...state, darkMode: true };
        case ActionType.DARK_MODE_OFF:
            return { ...state, darkMode: false };
        case ActionType.CART_ADD_ITEM: {
            const newItem: any = action.payload;
            const existItem = state.cart.cartItems.find(
                (item: ProductType) => item._id === newItem._id
            );
            const cartItems = existItem
                ? state.cart.cartItems.map((item: ProductType) =>
                      item.name === existItem.name ? newItem : item
                  )
                : [...state.cart.cartItems, newItem];
            Cookies.set('cartItems', JSON.stringify(cartItems));
            return { ...state, cart: { ...state.cart, cartItems } };
        }
        case ActionType.CART_REMOVE_ITEM: {
            const targetItem: any = action.payload;
            const cartItems = state.cart.cartItems.filter(
                (item: ProductType) => item._id !== targetItem._id
            );
            Cookies.set('cartItems', JSON.stringify(cartItems));
            return { ...state, cart: { ...state.cart, cartItems } };
        }
        case ActionType.SAVE_SHIPPING_ADDRESS:
            return {
                ...state,
                cart: { ...state.cart, shippingAddress: action.payload },
            };
        case ActionType.SAVE_PAYMENT_METHOD:
            return {
                ...state,
                cart: { ...state.cart, paymentMethod: action.payload },
            };
        case ActionType.CART_CLEAR:
            return { ...state, cart: { ...state.cart, cartItems: [] } };
        case ActionType.USER_LOGIN:
            return { ...state, userInfo: action.payload };
        case ActionType.USER_LOGOUT:
            return {
                ...state,
                userInfo: null,
                cart: { cartItems: [], shippingAddress: {}, paymentMethod: '' },
            };
        default:
            return state;
    }
}

export const StoreProvider: React.FC = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <Store.Provider value={{ state, dispatch }}>
            {props.children}
        </Store.Provider>
    );
};
