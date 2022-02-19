import styles from './CartPage.module.scss';
import DefaultLayout from '../../layouts/DefaultLayout';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../../../utils/Store';
import Link from 'next/link';
import Image from 'next/image';
import { ProductType } from '../../../../typings';

const CartPage = () => {
    const { state } = useContext(Store);
    const {
        cart: { cartItems },
    } = state;
    // const { cartItems } = cart; Resumed in the above line.
    const [cartItemsClientSide, setCartItemsClientSide] = useState<
        ProductType[]
    >([]);

    // useEffect(() => {
    //     setCartItemsLength(cartItems.length === 0);
    // }, [cartItems.length]);

    useEffect(() => {
        setCartItemsClientSide(cartItems);
    }, [cartItems]);

    return (
        <DefaultLayout title='Shopping Cart'>
            <>
                <h1>Shopping Cart</h1>
                {cartItemsClientSide.length === 0 ? (
                    <div>
                        Cart is Empty.{' '}
                        <Link href='/'>
                            <a>Go Shopping</a>
                        </Link>
                    </div>
                ) : (
                    <div className={styles.container}>
                        <div className={styles.rows}>
                            <div className={styles.left}>
                                {/* <div className={styles.leftLeft}> */}
                                <div className={styles.Image}>Image</div>
                                <div className={styles.Name}>Name</div>
                                {/* </div> */}

                                {/* <div className={styles.leftRight}> */}
                                <div className={styles.Quantity}>Quantity</div>
                                <div className={styles.Price}>Price</div>
                                <div className={styles.Action}>Action</div>
                                {/* </div> */}
                            </div>

                            <hr />

                            {cartItemsClientSide.map((item: ProductType) => (
                                <div className={styles.left} key={item._id}>
                                    {/* <div className={styles.leftLeft}> */}
                                    <div className={styles.Image}>
                                        <Link href={`/product/${item.slug}`}>
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
                                        <Link href={`/product/${item.slug}`}>
                                            <a>
                                                <p>{item.name}</p>
                                            </a>
                                        </Link>
                                    </div>
                                    {/* </div> */}

                                    {/* <div className={styles.leftRight}> */}
                                    <div className={styles.Quantity}>
                                        <select
                                            name='quantity'
                                            id='quantity'
                                            value={item.quantity}
                                        >
                                            {[
                                                ...Array(
                                                    item.countInStock
                                                ).keys(),
                                            ].map((x) => (
                                                <option
                                                    value={x + 1}
                                                    key={x + 1}
                                                >
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={styles.Price}>
                                        <p>${item.price}</p>
                                    </div>
                                    <div className={styles.Action}>
                                        <button>x</button>
                                    </div>
                                    {/* </div> */}
                                </div>
                            ))}
                        </div>
                        <div className={styles.right}>
                            <div className={styles.card}>
                                <h2>
                                    Subtotal (
                                    {cartItemsClientSide.reduce(
                                        (a: number, c: ProductType) =>
                                            a + c.quantity,
                                        0
                                    )}{' '}
                                    : $
                                    {cartItemsClientSide.reduce(
                                        (a: number, c: ProductType) =>
                                            a + c.quantity * c.price,
                                        0
                                    )}
                                    )
                                </h2>
                                <button>CHECK OUT</button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        </DefaultLayout>
    );
};

export default CartPage;
