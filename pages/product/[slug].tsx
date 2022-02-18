import Product from '../../models/Product';
import dbConnect, { convertDocToObj } from '../../lib/dbConnect';
import { GetServerSideProps } from 'next';
import ProductPage from '../../app/components/templates/ProductPage';
import { ProductType } from '../../typings';

interface Props {
    product?: ProductType;
    errors?: string;
}

const ProductScreen = ({ product }: Props) => {
    if (!product) {
        return <div>Product Not Found !</div>;
    }
    return (
        <div>
            <ProductPage product={product} />
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    try {
        const slug = params?.slug;

        await dbConnect();

        /* find the item that correspond to the specific slug from params */
        const results = await Product.findOne({ slug }).lean();
        const product = convertDocToObj(results);

        return { props: { product: product } };
    } catch (err: any) {
        return { props: { errors: err.message } };
    }
};

export default ProductScreen;
