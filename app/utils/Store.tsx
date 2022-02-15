import { createContext, useReducer } from 'react';
import Cookies from 'js-cookie';

type InitialStateType = {
    darkMode: boolean;
};

export enum ThemeActionType {
    DARK_MODE_ON,
    DARK_MODE_OFF,
}

interface ThemeActionTypes {
    type: ThemeActionType;
    payload?: unknown;
}

const initialState = {
    darkMode: Cookies.get('darkMode') === 'ON' ? true : false,
};

export const Store = createContext<{
    state: InitialStateType;
    dispatch: React.Dispatch<any>;
}>({
    state: initialState,
    dispatch: () => null,
});

function reducer(state: InitialStateType, action: ThemeActionTypes) {
    switch (action.type) {
        case ThemeActionType.DARK_MODE_ON:
            return { ...state, darkMode: true };
        case ThemeActionType.DARK_MODE_OFF:
            return { ...state, darkMode: false };
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
