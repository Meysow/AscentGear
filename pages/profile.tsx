import dynamic from 'next/dynamic';
const DynamicProfilePage = dynamic(
    () => import('../app/components/templates/ProfilePage'),
    { ssr: false }
);

const OrderHistory = () => {
    return <DynamicProfilePage />;
};

export default OrderHistory;
