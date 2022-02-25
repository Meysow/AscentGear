import dynamic from 'next/dynamic';
const DynamicRegisterPage = dynamic(
    () => import('../app/components/templates/RegisterPage')
);

export default function Register() {
    return <DynamicRegisterPage />;
}
