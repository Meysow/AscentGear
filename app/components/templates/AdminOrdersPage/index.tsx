import styles from './AdminOrdersPage.module.scss';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useContext, useReducer } from 'react';
import { Store } from '../../../utils/Store';
import { getError } from '../../../utils/error';
import Button from '../../elements/Button';
import LoadingSpinner from '../../elements/LoadingSpinner';
import { OrderTypesTwo } from '../../../../typings';

const DynamicDefaultLayout = dynamic(
    () => import('../../layouts/DefaultLayout')
);

const formatDate = (date: string) => {
    const isoDate = new Date(date);
    return isoDate.toLocaleString('en-GB');
};

interface IState {
    loading: boolean;
    orders: any;
    error: string;
}

const initialState: IState = {
    loading: true,
    orders: [],
    error: '',
};

function reducer(state: IState, action: any) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false,
                orders: action.payload,
                error: '',
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

const AdminOrdersPage = () => {
    const { state } = useContext(Store);
    const router = useRouter();
    const { userInfo } = state;

    const [{ loading, error, orders }, dispatch] = useReducer(
        reducer,
        initialState
    );

    useEffect(() => {
        if (!userInfo) {
            router.push('/login');
        }
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/admin/orders`, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <DynamicDefaultLayout title='Admin Orders'>
            <>
                <div className={styles.container}>
                    <div className={styles.containerLeft}>
                        <div className={styles.containerLeftButton}>
                            <Button
                                color='tertiary'
                                onClickHandler={() =>
                                    router.push('/admin/dashboard')
                                }
                            >
                                DashBoard
                            </Button>

                            <Button
                                selected
                                color='tertiary'
                                onClickHandler={() =>
                                    router.push('/admin/orders')
                                }
                            >
                                Orders
                            </Button>

                            <Button
                                color='tertiary'
                                onClickHandler={() =>
                                    router.push('/admin/products')
                                }
                            >
                                Products
                            </Button>
                        </div>
                    </div>
                    <div className={styles.containerRight}>
                        <h1>Orders</h1>
                        <div className={styles.row}>
                            <div className={styles.Id}>ID</div>
                            <div className={styles.User}>USER</div>
                            <div className={styles.Date}>DATE</div>
                            <div className={styles.Total}>TOTAL</div>
                            <div className={styles.Paid}>PAID</div>
                            <div className={styles.Delivered}>DELIVERED</div>
                            <div className={styles.Action}>ACTION</div>
                        </div>
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
                                        <p className={styles.User}>
                                            {order.user
                                                ? order.user.name
                                                : 'DELETED USER'}
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

export default AdminOrdersPage;
