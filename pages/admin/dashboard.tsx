import dynamic from 'next/dynamic';
const DynamicAdminDashboardPage = dynamic(
    () => import('../../app/components/templates/AdminDashboardPage'),
    { ssr: false }
);

const AdminDashboard = () => {
    return <DynamicAdminDashboardPage />;
};

export default AdminDashboard;
