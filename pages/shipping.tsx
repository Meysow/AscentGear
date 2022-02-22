import dynamic from 'next/dynamic';
const DynamicShipping = dynamic(
    () => import('../app/components/templates/Shipping')
);

const Shipping = () => {
    return (
        <>
            <DynamicShipping />
        </>
    );
};

export default Shipping;
