import dynamic from 'next/dynamic';
const DynamicOrderHistory = dynamic(
    () => import('../app/components/templates/OrderHistory'),
    { ssr: false }
);

const OrderHistory = () => {
    return <DynamicOrderHistory />;
};

export default OrderHistory;
