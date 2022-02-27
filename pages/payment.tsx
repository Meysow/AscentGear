import dynamic from 'next/dynamic';
const DynamicPayment = dynamic(
    () => import('../app/components/templates/PaymentPage')
);

const Payment = () => {
    return <DynamicPayment />;
};

export default Payment;
