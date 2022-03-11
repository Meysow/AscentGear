import styles from './Product.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { ProductType } from '../../../../typings';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { Store, ActionType } from '../../../utils/Store';
import axios from 'axios';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Button from '../../elements/Button';

import { getError } from '../../../utils/error';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../elements/LoadingSpinner';
import { Rating } from 'react-simple-star-rating';

const DynamicDefaultLayout = dynamic(
    () => import('../../layouts/DefaultLayout'),
    { ssr: false }
);

interface Props {
    product: ProductType;
}

const ProductPage = ({ product }: Props) => {
    const router = useRouter();
    const { dispatch, state } = useContext(Store);
    const { userInfo } = state;

    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(
                `/api/products/${product._id}/reviews`,
                {
                    rating,
                    comment,
                },
                {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                }
            );
            setLoading(false);
            toast.success('Review submitted successfully', {
                theme: 'colored',
            });
            fetchReviews();
        } catch (err) {
            setLoading(false);
            toast.error('Review submitted successfully', {
                theme: 'colored',
            });
        }
    };

    const fetchReviews = async () => {
        try {
            const { data } = await axios.get(
                `/api/products/${product._id}/reviews`
            );
            setReviews(data);
        } catch (err) {
            toast.error(getError(err), { theme: 'colored' });
        }
    };
    useEffect(() => {
        fetchReviews();
    }, []);

    const addToCartHandler = async () => {
        const existItem = state.cart.cartItems.find(
            (x: ProductType) => x._id === product._id
        );
        const quantity = existItem ? existItem.quantity + 1 : 1;

        const { data } = await axios.get(`/api/products/${product._id}`);
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

    const handleRating = (rate: number) => {
        setRating(rate / 20);
    };

    return (
        <DynamicDefaultLayout title={product.name}>
            <>
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
                                <li className={styles.reviews}>
                                    <Rating
                                        ratingValue={product.rating * 20}
                                        readonly
                                        allowHalfIcon
                                        size={23}
                                    />
                                    <Link href='#reviews'>
                                        <a className={styles.link}>
                                            ({product.numReviews} reviews)
                                        </a>
                                    </Link>
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
                <div className={styles.list}>
                    <h2 id='reviews'>Customer Reviews</h2>

                    {reviews.length === 0 && <p>No review</p>}
                    {reviews.map((review: any) => (
                        <div className={styles.ListItem} key={review._id}>
                            <div className={styles.flexContainer}>
                                <div className={styles.reviewItem}>
                                    <p>
                                        <strong>{review.name}</strong>
                                    </p>
                                    <p>{review.createdAt.substring(0, 10)}</p>
                                </div>
                                <div className={styles.reviewItem}>
                                    <Rating
                                        ratingValue={product.rating * 20}
                                        readonly
                                        allowHalfIcon
                                        size={23}
                                    />
                                    <p>{review.comment}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className={styles.ListItem}>
                        {userInfo ? (
                            <form
                                onSubmit={submitHandler}
                                className={styles.reviewForm}
                            >
                                <div>
                                    <h2>Leave your review</h2>
                                    <label className={styles.lbl}>
                                        Give a note:
                                        <Rating
                                            ratingValue={rating}
                                            allowHalfIcon
                                            transition
                                            size={23}
                                            onClick={handleRating}
                                        />
                                    </label>

                                    <label className={styles.lbl}>
                                        Your Review:
                                        <textarea
                                            id='review'
                                            placeholder='Your Review'
                                            className={styles.ipt}
                                            rows={4}
                                            onChange={(e) =>
                                                setComment(e.target.value)
                                            }
                                        />
                                    </label>

                                    <Button
                                        onClickHandler={() =>
                                            console.log('Review Posted !')
                                        }
                                        submit
                                    >
                                        Submit
                                    </Button>

                                    {loading && <LoadingSpinner />}
                                </div>
                            </form>
                        ) : (
                            <p>
                                Please{' '}
                                <Link
                                    href={`/login?redirect=/product/${product.slug}`}
                                >
                                    <a className={styles.link}>Login</a>
                                </Link>{' '}
                                to write a review
                            </p>
                        )}
                    </div>
                </div>
            </>
        </DynamicDefaultLayout>
    );
};

export default ProductPage;
