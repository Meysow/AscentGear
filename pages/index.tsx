import HomePage from '../app/components/templates/HomePage';
import dbConnect, { convertDocToObj } from '../lib/dbConnect';
import Product from '../models/Product';
import { ProductArray } from '../typings';
import dynamic from 'next/dynamic';
const DynamicDefaultLayout = dynamic(
    () => import('../app/components/layouts/DefaultLayout'),
    {
        ssr: false,
    }
);

const Home = ({ products }: ProductArray) => {
    return (
        <DynamicDefaultLayout>
            <HomePage products={products} />
        </DynamicDefaultLayout>
    );
};

/* Retrieves pet(s) data from mongodb database */
export async function getServerSideProps() {
    await dbConnect();

    /* find all the data in our database */
    // const results = await Product.find({}).lean();
    const results = await Product.find({}, '-reviews').lean();

    const products = results.map(convertDocToObj);

    return { props: { products: products } };
}

export default Home;
