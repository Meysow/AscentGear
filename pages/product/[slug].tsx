import { useRouter } from 'next/router';
import data from '../../app/utils/data';
import Product from '../../app/components/templates/Product';

const ProductScreen = () => {
    const router = useRouter();
    const { slug } = router.query;
    const product = data.products.find((a) => a.slug === slug);
    if (!product) {
        return <div>Product Not Found !</div>;
    }
    return (
        <div>
            <Product product={product} />
        </div>
    );
};

export default ProductScreen;
