import dynamic from 'next/dynamic';
const DynamicShipping = dynamic(
    () => import('../app/components/templates/Shipping'),
    { ssr: false }
);

const Shipping = () => {
    return <DynamicShipping />;
};

export default Shipping;
