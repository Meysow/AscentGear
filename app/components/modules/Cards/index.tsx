import styles from './Cards.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { ProductArray, ProductType } from '../../../../typings';
import Button from '../../elements/Button';
import axios from 'axios';
import { useContext } from 'react';
import { ActionType, Store } from '../../../utils/Store';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { Rating } from 'react-simple-star-rating';

export default function Cards({ products }: ProductArray) {
    const { dispatch, state } = useContext(Store);
    const { darkMode } = state;
    const router = useRouter();

    const addToCartHandler = async (product: ProductType) => {
        const existItem = state.cart.cartItems.find(
            (x: ProductType) => x._id === product._id
        );
        const quantity = existItem ? existItem.quantity + 1 : 1;

        const { data } = await axios.get(`/api/products/${product._id}`);
        if (data.data.countInStock < quantity) {
            toast.error(`Sorry, Product is out of stock`, {
                theme: 'colored',
            });
            return;
        }

        dispatch({
            type: ActionType.CART_ADD_ITEM,
            payload: { ...product, quantity },
        });
        router.push('/cart');
    };

    const isDarkMode = darkMode ? styles.darkMode : '';

    return (
        <div className={styles.container}>
            {products.map((product) => (
                <div
                    className={`${styles.card} ${isDarkMode}`}
                    key={product.name}
                >
                    <Link href={`/product/${product.slug}`} passHref>
                        <div className={styles['image-container']}>
                            <Image
                                src={product.image}
                                alt={product.name}
                                height={10}
                                width={10}
                                layout='responsive'
                                objectFit='cover'
                                priority
                            />
                        </div>
                    </Link>

                    <div className={styles['card__content']}>
                        <div className={styles.flex}>
                            <p className={styles['card__content--title']}>
                                {product.name}
                            </p>
                            <Rating
                                ratingValue={product.rating * 20}
                                readonly
                                allowHalfIcon
                                size={23}
                            />
                        </div>
                        <div className={styles['card__content--body']}>
                            <p>${product.price}</p>
                            <Button
                                onClickHandler={() => addToCartHandler(product)}
                            >
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
