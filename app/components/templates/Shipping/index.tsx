import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Store } from '../../../utils/Store';
// import DefaultLayout from '../../layouts/DefaultLayout';

const DynamicDefaultLayout = dynamic(
    () => import('../../layouts/DefaultLayout')
);

const Shipping = () => {
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    const router = useRouter();

    if (!userInfo) {
        router.push('/login?redirect=/shipping');
    }
    return (
        <DynamicDefaultLayout>
            <h1>Shipping !</h1>
        </DynamicDefaultLayout>
    );
};

export default Shipping;
