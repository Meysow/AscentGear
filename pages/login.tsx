import dynamic from 'next/dynamic';
const DynamicLoginPage = dynamic(
    () => import('../app/components/templates/LoginPage')
);

export default function Loggin() {
    return <DynamicLoginPage />;
}
