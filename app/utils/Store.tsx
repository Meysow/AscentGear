import { createContext, useReducer } from 'react';
import Cookies from 'js-cookie';
import { ProductType } from '../../typings';

interface InitialStateType {
    darkMode: boolean;
    cart: any;
}

export enum ActionType {
    DARK_MODE_ON,
    DARK_MODE_OFF,
    CART_ADD_ITEM,
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
    },
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
