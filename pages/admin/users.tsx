import dynamic from 'next/dynamic';
const DynamicAdminUsersPage = dynamic(
    () => import('../../app/components/templates/AdminUsersPage'),
    { ssr: false }
);

const AdminUsers = () => {
    return <DynamicAdminUsersPage />;
};

export default AdminUsers;
