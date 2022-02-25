import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
const DynamicOrderPage = dynamic(
    () => import('../../app/components/templates/OrderPage'),
    { ssr: false }
);

interface Props {
    params: {
        id: string;
    };
}

const cartScreen = ({ params }: Props) => {
    return <DynamicOrderPage orderId={params.id} />;
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    return {
        props: {
            params,
        },
    };
};

export default cartScreen;
