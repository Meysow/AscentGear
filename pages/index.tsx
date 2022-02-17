import Layout from '../app/components/layouts/DefaultLayout';
import HomePage from '../app/components/templates/HomePage';
import dbConnect from '../lib/dbConnect';
import Product from '../models/Product';
import { ProductArray } from '../typings';

const Home = ({ products }: ProductArray) => {
    return (
        <Layout>
            <HomePage products={products} />
        </Layout>
    );
};

/* Retrieves pet(s) data from mongodb database */
export async function getServerSideProps() {
    await dbConnect();

    /* find all the data in our database */
    const results = await Product.find({}).lean();

    const products = results.map((doc) => {
        doc._id = doc._id.toString();
        doc.createdAt = doc.createdAt.toString();
        doc.updatedAt = doc.updatedAt.toString();
        return doc;
    });

    return { props: { products: products } };
}

export default Home;
