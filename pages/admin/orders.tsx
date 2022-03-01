import dynamic from 'next/dynamic';
const DynamicAdminOrdersPage = dynamic(
    () => import('../../app/components/templates/AdminOrdersPage'),
    { ssr: false }
);

const AdminOrders = () => {
    return <DynamicAdminOrdersPage />;
};

export default AdminOrders;
