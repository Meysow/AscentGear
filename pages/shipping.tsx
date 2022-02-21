import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
const DynamicShipping = dynamic(
    () => import('../app/components/templates/Shipping')
);

const Shipping = () => {
    const router = useRouter();
    router.push('/login');
    return (
        <>
            <DynamicShipping />
        </>
    );
};

export default Shipping;
