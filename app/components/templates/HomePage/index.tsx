import Image from "next/image";
import Link from "next/link";
import { ProductType } from "../../../../typings";
import Carousel, { CarouselItem } from "../../elements/Carousel";
import SearchBox from "../../elements/SearchBox";
// import Cards from "../../modules/Cards";
import dynamic from "next/dynamic";
import styles from "./HomePage.module.scss";

const Cards = dynamic(() => import("../../modules/Cards"), {
  ssr: true,
  loading: () => <p>Loading...</p>,
});

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
            <a className={styles.imageContainer}>
              <Image
                src={product.featuredImage}
                alt={product.name}
                layout="fill"
                objectFit="cover"
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
