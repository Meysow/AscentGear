import dynamic from 'next/dynamic';
const DynamicPlaceOrder = dynamic(
    () => import('../app/components/templates/PlaceOrderPage'),
    { ssr: false }
);

const PlaceOrder = () => {
    return <DynamicPlaceOrder />;
};

export default PlaceOrder;
