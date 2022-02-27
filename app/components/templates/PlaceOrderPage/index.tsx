import styles from './PlaceOrderPage.module.scss';
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Button from '../../elements/Button';
import CheckoutWizard from '../../elements/CheckoutWizard';
import { ActionType, Store } from '../../../utils/Store';
import { ProductType } from '../../../../typings';
import { getError } from '../../../utils/error';
const DynamicDefaultLayout = dynamic(
    () => import('../../layouts/DefaultLayout')
);

const PlaceOrderPage = () => {
    const router = useRouter();
    const { state, dispatch } = useContext(Store);
    const {
        userInfo,
        cart: { cartItems, shippingAddress, paymentMethod },
    } = state;

    console.log(shippingAddress);

    const round2 = (num: number) =>
        Math.round(num * 100 + Number.EPSILON) / 100;
    const itemsPrice = round2(
        cartItems.reduce(
            (a: number, c: ProductType) => a + c.price * c.quantity,
            0
        )
    );
    const shippingPrice = itemsPrice >= 200 ? 0 : 15;
    const taxPrice = round2(itemsPrice * 0.15);
    const totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

    useEffect(() => {
        if (!paymentMethod) {
            router.push('/payment');
        }
        if (cartItems.length === 0) {
            router.push('/cart');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [loading, setLoading] = useState(false);

    const placeOrderHandler = async () => {
        toast.dismiss();
        try {
            setLoading(true);
            const { data } = await axios.post(
                '/api/orders',
                {
                    orderItems: cartItems,
                    shippingAddress,
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    taxPrice,
                    totalPrice,
                },
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );
            dispatch({ type: ActionType.CART_CLEAR });
            Cookies.remove('cartItems');
            setLoading(false);
            router.push(`/order/${data._id}`);
        } catch (err) {
            setLoading(false);
            toast.error(getError(err), {
                theme: 'colored',
            });
        }
    };

    return (
        <DynamicDefaultLayout title='Place Order'>
            <>
                <div className={styles.wrapper}>
                    <CheckoutWizard activeStep={3} />
                </div>
                <h1>Place Order</h1>

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
                        </div>
                        <div className={styles.rows}>
                            <h3>Payment Method</h3>
                            <p>{paymentMethod}</p>
                        </div>
                        <div className={styles.rows}>
                            <h3>Order Items</h3>
                            <div className={styles.left}>
                                <div className={styles.Image}>Image</div>
                                <div className={styles.Name}>Name</div>
                                <div className={styles.Quantity}>Quantity</div>
                                <div className={styles.Price}>Price</div>
                            </div>

                            <hr className={styles.hrTop} />

                            {cartItems.map((item: ProductType) => (
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
                            <Button
                                fullWidth
                                color={'default'}
                                onClickHandler={placeOrderHandler}
                            >
                                PLACE ORDER
                            </Button>
                            {loading && <p>Loading...</p>}
                        </div>
                    </div>
                </div>
            </>
        </DynamicDefaultLayout>
    );
};

export default PlaceOrderPage;
