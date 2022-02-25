import styles from './OrderPage.module.scss';
import { useContext, useEffect, useReducer } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useRouter } from 'next/router';
import CheckoutWizard from '../../elements/CheckoutWizard';
import { Store } from '../../../utils/Store';
import { OrderTypes, ProductType } from '../../../../typings';
import { getError } from '../../../utils/error';
const DynamicDefaultLayout = dynamic(
    () => import('../../layouts/DefaultLayout')
);

interface Props {
    orderId: string;
}

enum FetchActionType {
    FETCH_REQUEST,
    FETCH_SUCCESS,
    FETCH_FAIL,
}

interface IAction {
    type: FetchActionType;
    payload?: unknown;
}

interface IState {
    loading: boolean;
    order?: any;
    error?: string;
}

function reducer(state: any, action: IAction) {
    switch (action.type) {
        case FetchActionType.FETCH_REQUEST:
            return { ...state, loading: true, error: '' };
        case FetchActionType.FETCH_SUCCESS:
            return {
                ...state,
                loading: false,
                order: action.payload,
                error: '',
            };
        case FetchActionType.FETCH_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            state;
    }
}

const OrderPage = ({ orderId }: Props) => {
    const router = useRouter();
    const { state } = useContext(Store);
    const { userInfo } = state;

    const [{ loading, error, order }, dispatch] = useReducer(reducer, {
        loading: true,
        order: {},
        error: '',
    });

    const {
        shippingAddress,
        paymentMethod,
        orderItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid,
        paidAt,
        isDelivered,
        deliveredAt,
    } = order;

    useEffect(() => {
        if (!userInfo) {
            router.push('/login');
        }
        const fetchOrder = async () => {
            try {
                dispatch({ type: FetchActionType.FETCH_REQUEST });
                const { data } = await axios.get(`/api/orders/${orderId}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
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
        if (!order._id || (order._id && order._id !== orderId)) {
            fetchOrder();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order]);

    return (
        <DynamicDefaultLayout title={`Order ${orderId}`}>
            <>
                <div className={styles.wrapper}>
                    <CheckoutWizard activeStep={4} />
                </div>
                <h1>
                    Order <span className={styles.orderId}>{orderId}</span>
                </h1>

                {loading ? (
                    <span>Loading...</span>
                ) : error ? (
                    <p className={styles.error}>{error}</p>
                ) : (
                    <div className={styles.container}>
                        <div className={styles.leftSection}>
                            <div className={styles.rows}>
                                <h3>Shipping Adress</h3>
                                <div className={styles.flexContainer}>
                                    <div className={styles.flexContainerLeft}>
                                        <p>Name: </p>
                                        <p>Address: </p>
                                        <p>City: </p>
                                        <p>Postal Code: </p>
                                        <p>Country: </p>
                                    </div>
                                    <div className={styles.flexContainerRight}>
                                        <p>{shippingAddress.name}</p>
                                        <p>{shippingAddress.address}</p>
                                        <p>{shippingAddress.city}</p>
                                        <p>{shippingAddress.postalCode}</p>
                                        <p>{shippingAddress.country}</p>
                                    </div>
                                </div>
                                <div className={styles.status}>
                                    <p>
                                        Status:{' '}
                                        {isDelivered
                                            ? `Delivered at ${deliveredAt}`
                                            : 'Not Delivered'}
                                    </p>
                                </div>
                            </div>
                            <div className={styles.rows}>
                                <h3>Payment Method</h3>
                                <p>{paymentMethod}</p>
                                <div className={styles.status}>
                                    <p>
                                        Status:{' '}
                                        {isPaid
                                            ? `Paid at ${paidAt}`
                                            : 'Not paid'}
                                    </p>
                                </div>
                            </div>
                            <div className={styles.rows}>
                                <h3>Order Items</h3>
                                <div className={styles.left}>
                                    <div className={styles.Image}>Image</div>
                                    <div className={styles.Name}>Name</div>
                                    <div className={styles.Quantity}>
                                        Quantity
                                    </div>
                                    <div className={styles.Price}>Price</div>
                                </div>

                                <hr className={styles.hrTop} />

                                {orderItems.map((item: ProductType) => (
                                    <div key={item._id}>
                                        <div className={styles.left}>
                                            <div className={styles.Image}>
                                                <Link
                                                    href={`/product/${item.slug}`}
                                                >
                                                    <a>
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            width={50}
                                                            height={50}
                                                        />
                                                    </a>
                                                </Link>
                                            </div>

                                            <div className={styles.Name}>
                                                <Link
                                                    href={`/product/${item.slug}`}
                                                >
                                                    <a>
                                                        <p>{item.name}</p>
                                                    </a>
                                                </Link>
                                            </div>

                                            <div className={styles.Quantity}>
                                                <p>{item.quantity}</p>
                                            </div>
                                            <div className={styles.Price}>
                                                <p>${item.price}</p>
                                            </div>
                                        </div>
                                        <hr className={styles.hrBottom} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.right}>
                            <div className={styles.card}>
                                <h3>Order Summary</h3>
                                <div className={styles.flexContainer}>
                                    <div className={styles.flexContainerLeft}>
                                        <p>Items: </p>
                                        <p>Tax: </p>
                                        <p>Shipping: </p>
                                        <p>
                                            <strong>Total: </strong>
                                        </p>
                                    </div>
                                    <div className={styles.flexContainerRight}>
                                        <p>${itemsPrice}</p>
                                        <p>${taxPrice}</p>
                                        <p>${shippingPrice}</p>
                                        <p>
                                            <strong>${totalPrice}</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        </DynamicDefaultLayout>
    );
};

export default OrderPage;
