import HomePage from '../app/components/templates/HomePage';
import dbConnect, { convertDocToObj } from '../lib/dbConnect';
import Product from '../models/Product';
import { ProductType } from '../typings';
import dynamic from 'next/dynamic';
const DynamicDefaultLayout = dynamic(
    () => import('../app/components/layouts/DefaultLayout'),
    {
        ssr: false,
    }
);

interface Props {
    topRatedProducts: ProductType[];
    featuredProducts: ProductType[];
}

const Home = ({ featuredProducts, topRatedProducts }: Props) => {
    return (
        <DynamicDefaultLayout title='Search'>
            <HomePage
                featuredProducts={featuredProducts}
                topRatedProducts={topRatedProducts}
            />
        </DynamicDefaultLayout>
    );
};

export async function getServerSideProps() {
    await dbConnect();

    /* find all the data in our database */
    const resultsFeaturedProduct = await Product.find(
        { isFeatured: true },
        '-reviews'
    )
        .lean()
        .limit(3);

    const featuredProducts = resultsFeaturedProduct.map(convertDocToObj);

    const resultsTopRatedProducts = await Product.find({}, '-reviews')
        .lean()
        .sort({
            rating: -1,
        })
        .limit(6);

    const topRatedProducts = resultsTopRatedProducts.map(convertDocToObj);

    return {
        props: {
            featuredProducts: featuredProducts,
            topRatedProducts: topRatedProducts,
        },
    };
}

export default Home;
