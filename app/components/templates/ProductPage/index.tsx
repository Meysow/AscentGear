import styles from './Product.module.scss';
import Link from 'next/link';
import DefaultLayout from '../../layouts/DefaultLayout';
import Image from 'next/image';
import { ProductType } from '../../../../typings';
import { useContext } from 'react';
import { Store, ActionType } from '../../../utils/Store';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Props {
    product: ProductType;
}

const ProductPage = ({ product }: Props) => {
    const router = useRouter();
    const { dispatch } = useContext(Store);

    const addToCartHandler = async () => {
        const { data } = await axios.get(`/api/products/${product._id}`);

        if (data.countInStock <= 0) {
            window.alert('Sorry, Product is out of stock');
            return;
        }

        dispatch({
            type: ActionType.CART_ADD_ITEM,
            payload: { ...product, quantity: 1 },
        });
        router.push('/cart');
    };

    return (
        <DefaultLayout>
            <div>
                <Link href='/'>
                    <a>
                        <p className={styles.marg}>Back To Products</p>
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
                            <p>{product.price}</p>
                        </div>
                        <div className={styles.paymentDetails}>
                            <p>Status:</p>
                            <p>
                                {product.countInStock > 0
                                    ? 'In Stock'
                                    : 'Out of Stock'}
                            </p>
                        </div>
                        <div className={styles.bgWhite}>
                            <button onClick={addToCartHandler}>
                                ADD TO CART
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default ProductPage;
