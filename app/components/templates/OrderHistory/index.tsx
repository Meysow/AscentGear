import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useContext, useEffect, useReducer } from 'react';
import { OrderTypesTwo } from '../../../../typings';
import { getError } from '../../../utils/error';
import { Store } from '../../../utils/Store';
import Button from '../../elements/Button';
import LoadingSpinner from '../../elements/LoadingSpinner';
import styles from './OrderHistory.module.scss';
const DynamicDefaultLayout = dynamic(
    () => import('../../layouts/DefaultLayout'),
    { ssr: false }
);

const formatDate = (date: string) => {
    const isoDate = new Date(date);
    return isoDate.toLocaleString('en-GB');
};

interface Istate {
    loading: boolean;
    orders: OrderTypesTwo[];
    error: string;
}

const initialState: Istate = {
    loading: true,
    orders: [],
    error: '',
};

enum FetchActionType {
    FETCH_REQUEST,
    FETCH_SUCCESS,
    FETCH_FAIL,
    PAY_REQUEST,
    PAY_SUCCESS,
    PAY_FAIL,
    PAY_RESET,
}

interface IFetchAction {
    type: FetchActionType;
    payload?: any;
}

function reducer(state: Istate, action: IFetchAction): Istate {
    switch (action.type) {
        case FetchActionType.FETCH_REQUEST:
            return { ...state, loading: true, error: '' };
        case FetchActionType.FETCH_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: action.payload,
                error: '',
            };
        case FetchActionType.FETCH_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
}

const OrderHistoryPage = () => {
    const router = useRouter();
    const { state } = useContext(Store);
    const { userInfo } = state;

    const [{ loading, orders, error }, dispatch] = useReducer(
        reducer,
        initialState
    );

    useEffect(() => {
        if (!userInfo) {
            router.push('/login');
        }
        const fetchOrders = async () => {
            try {
                dispatch({ type: FetchActionType.FETCH_REQUEST });
                const { data } = await axios.get(`/api/orders/history`, {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                    },
                });
                dispatch({
                    type: FetchActionType.FETCH_SUCCESS,
                    payload: data,
                });
            } catch (err) {
                dispatch({
                    type: FetchActionType.FETCH_FAIL,
                    payload: getError(err),
                });
            }
        };
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <DynamicDefaultLayout title={`Order History`}>
            <>
                <div className={styles.container}>
                    <div className={styles.containerLeft}>
                        <div className={styles.containerLeftButton}>
                            <Button
                                color='tertiary'
                                onClickHandler={() => router.push('/profile')}
                            >
                                User Profile
                            </Button>

                            <Button
                                color='tertiary'
                                onClickHandler={() =>
                                    router.push('/order-history')
                                }
                                selected
                            >
                                Order History
                            </Button>
                        </div>
                    </div>
                    <div className={styles.containerRight}>
                        <h1>Order History</h1>
                        <div className={styles.row}>
                            <div className={styles.Id}>Id</div>
                            <div className={styles.Date}>Date</div>
                            <div className={styles.Total}>Total</div>
                            <div className={styles.Paid}>Paid</div>
                            <div className={styles.Delivered}>Delivered</div>
                            <div className={styles.Action}>Action</div>
                        </div>
                        <hr />
                        {loading ? (
                            <LoadingSpinner />
                        ) : error ? (
                            <p className={styles.error}>{error}</p>
                        ) : (
                            <>
                                {orders.map((order: OrderTypesTwo) => (
                                    <div className={styles.row} key={order._id}>
                                        <p className={styles.Id}>
                                            {order._id.substring(20, 24)}
                                        </p>
                                        <p className={styles.Date}>
                                            {formatDate(order.createdAt)}
                                        </p>
                                        <p className={styles.Total}>
                                            ${order.totalPrice}
                                        </p>
                                        <p className={styles.Paid}>
                                            {order.isPaid
                                                ? `Paid at ${order.paidAt}`
                                                : 'Not Paid'}
                                        </p>
                                        <p className={styles.Delivered}>
                                            {order.isDelivered
                                                ? `Delivered at ${order.deliveredAt}`
                                                : 'Not Delivered'}
                                        </p>
                                        <div className={styles.Action}>
                                            <Button
                                                color='tertiary'
                                                onClickHandler={() =>
                                                    router.push(
                                                        `/order/${order._id}`
                                                    )
                                                }
                                            >
                                                Details
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </>
        </DynamicDefaultLayout>
    );
};

export default OrderHistoryPage;
