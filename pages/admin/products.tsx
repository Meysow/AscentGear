import dynamic from 'next/dynamic';
const DynamicAdminProductsPage = dynamic(
    () => import('../../app/components/templates/AdminProductsPage'),
    { ssr: false }
);

const AdminOrders = () => {
    return <DynamicAdminProductsPage />;
};

export default AdminOrders;
