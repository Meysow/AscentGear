import styles from './Product.module.scss';
import Link from 'next/link';
import DefaultLayout from '../../layouts/DefaultLayout';
import Image from 'next/image';

interface Props {
    product: {
        name: string;
        slug: string;
        category: string;
        image: string;
        price: number;
        brand: string;
        rating: number;
        numReviews: number;
        countInStock: number;
        description: string;
    };
}

const index = ({ product }: Props) => {
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
                            <button>ADD TO CART</button>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default index;
