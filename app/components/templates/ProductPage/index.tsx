import styles from './Product.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { ProductType } from '../../../../typings';
import { useContext } from 'react';
import { Store, ActionType } from '../../../utils/Store';
import axios from 'axios';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Button from '../../elements/Button';
const DynamicDefaultLayout = dynamic(
    () => import('../../layouts/DefaultLayout')
);

interface Props {
    product: ProductType;
}

const ProductPage = ({ product }: Props) => {
    const router = useRouter();
    const { dispatch, state } = useContext(Store);

    const addToCartHandler = async () => {
        const { data } = await axios.get(`/api/products/${product._id}`);

        if (data.data.countInStock <= 0) {
            window.alert('Sorry, Product is out of stock');
            return;
        }
        const existItem = state.cart.cartItems.find(
            (x: ProductType) => x._id === product._id
        );
        const quantity = existItem ? existItem.quantity + 1 : 1;

        if (data.data.countInStock < quantity) {
            window.alert('Sorry, Product is out of stock');
            return;
        }

        dispatch({
            type: ActionType.CART_ADD_ITEM,
            payload: { ...product, quantity },
        });
        router.push('/cart');
    };

    return (
        <DynamicDefaultLayout title={product.name}>
            <div>
                <Link href='/'>
                    <a>
                        <p className={styles.marg}>↩ Back To Products</p>
                    </a>
                </Link>

                <div className={styles.container}>
                    <div className={styles.containerImage}>
                        <Image
                            src={product.image}
                            alt={product.name}
                            height={640}
                            width={640}
                            layout='responsive'
                            objectFit='cover'
                            priority
                        />
                    </div>

                    <div className={styles.containerInfo}>
                        <ul>
                            <li>
                                <h1>{product.name}</h1>
                            </li>
                            <li>Category: {product.category}</li>
                            <li>Brand: {product.brand}</li>
                            <li>
                                Ratings: {product.rating}/5 (
                                {product.numReviews} reviews)
                            </li>
                            <li>Description: {product.description}</li>
                        </ul>
                    </div>

                    <div className={styles.payment}>
                        <div className={styles.paymentDetails}>
                            <p>Price:</p>
                            <p>${product.price}</p>
                        </div>
                        <div className={styles.paymentDetails}>
                            <p>Status:</p>
                            <p>
                                {product.countInStock > 0
                                    ? 'In Stock'
                                    : 'Out of Stock'}
                            </p>
                        </div>

                        <Button onClickHandler={addToCartHandler}>
                            ADD TO CART
                        </Button>
                    </div>
                </div>
            </div>
        </DynamicDefaultLayout>
    );
};

export default ProductPage;
