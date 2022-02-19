import dynamic from 'next/dynamic';
const DynamicCartPage = dynamic(
    () => import('../app/components/templates/CartPage'),
    { ssr: false }
);

const cartScreen = () => {
    return (
        <>
            <DynamicCartPage />
        </>
    );
};

export default cartScreen;
