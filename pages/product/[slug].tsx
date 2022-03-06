import Product from '../../models/Product';
import dbConnect, { convertDocToObj } from '../../lib/dbConnect';
import { GetServerSideProps } from 'next';
import { ProductType } from '../../typings';
import dynamic from 'next/dynamic';

const DynamicProductPage = dynamic(
    () => import('../../app/components/templates/ProductPage'),
    { ssr: false }
);
interface Props {
    product?: ProductType;
    errors?: string;
}

const ProductScreen = ({ product, errors }: Props) => {
    if (errors) {
        return <div>{errors}</div>;
    }
    if (!product) {
        return <div>Product Not Found !</div>;
    }
    return <DynamicProductPage product={product} />;
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    try {
        const slug = params?.slug;

        await dbConnect();

        /* find the item that correspond to the specific slug from params */
        const results = await Product.findOne({ slug }, '-reviews').lean();
        const product = convertDocToObj(results);

        return { props: { product: product } };
    } catch (err: any) {
        return { props: { errors: err.message } };
    }
};

export default ProductScreen;
