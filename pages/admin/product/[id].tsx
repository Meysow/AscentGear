import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
const DynamicProductEditPage = dynamic(
    () => import('../../../app/components/templates/ProductEditPage'),
    { ssr: false }
);

interface Props {
    params: {
        id: string;
    };
}

const ProductEdit = ({ params }: Props) => {
    return <DynamicProductEditPage params={params} />;
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    return {
        props: { params },
    };
};

export default ProductEdit;
