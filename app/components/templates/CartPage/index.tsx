import styles from './CartPage.module.scss';
import { useContext } from 'react';
import { Store } from '../../../utils/Store';
import Link from 'next/link';
import Image from 'next/image';
import { ProductType } from '../../../../typings';
import dynamic from 'next/dynamic';
const DynamicDefaultLayout = dynamic(
    () => import('../../layouts/DefaultLayout')
);

const CartPage = () => {
    const { state } = useContext(Store);
    const {
        cart: { cartItems },
    } = state;

    return (
        <DynamicDefaultLayout title='Shopping Cart'>
            <>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <div className={styles.container}>
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

                            {cartItems.map((item: ProductType) => (
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
                                <p>
                                    Subtotal (
                                    {cartItems.reduce(
                                        (a: number, c: ProductType) =>
                                            a + c.quantity,
                                        0
                                    )}{' '}
                                    : $
                                    {cartItems.reduce(
                                        (a: number, c: ProductType) =>
                                            a + c.quantity * c.price,
                                        0
                                    )}
                                    )
                                </p>
                                <button>CHECK OUT</button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        </DynamicDefaultLayout>
    );
};

export default CartPage;
