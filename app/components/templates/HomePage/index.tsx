import styles from './HomePage.module.scss';
import Cards from '../../modules/Cards';
import { ProductType } from '../../../../typings';
import SearchBox from '../../elements/SearchBox';
import Carousel, { CarouselItem } from '../../elements/Carousel';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
    topRatedProducts: ProductType[];
    featuredProducts: ProductType[];
}

const HomePage = ({ topRatedProducts, featuredProducts }: Props) => (
    <main className={styles.content}>
        <SearchBox />
        <h2 className={styles.title}>Featured Products</h2>
        <Carousel>
            {featuredProducts.map((product: ProductType) => (
                <CarouselItem key={product._id}>
                    <Link href={`/product/${product.slug}`}>
                        <a
                            className={styles.imageContainer}
                            style={{
                                // TODO: Get it to styles //
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            <Image
                                src={product.featuredImage}
                                alt={product.name}
                                layout='fill'
                                objectFit='cover'
                                priority
                            />
                        </a>
                    </Link>
                </CarouselItem>
            ))}
        </Carousel>
        <h2 className={styles.title}>Popular Products</h2>
        <Cards products={topRatedProducts} />
    </main>
);

export default HomePage;
