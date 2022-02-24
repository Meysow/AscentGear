import dynamic from 'next/dynamic';
const DynamicPayment = dynamic(
    () => import('../app/components/templates/PaymentPage'),
    { ssr: false }
);

const Payment = () => {
    return (
        <>
            <DynamicPayment />
        </>
    );
};

export default Payment;
