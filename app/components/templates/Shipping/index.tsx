import { useContext, useEffect } from 'react';
import { ActionType, Store } from '../../../utils/Store';
import Button from '../../elements/Button';
import styles from './ShippingPage.module.scss';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import CheckoutWizard from '../../elements/CheckoutWizard';

const DynamicDefaultLayout = dynamic(
    () => import('../../layouts/DefaultLayout')
);

type FormValues = {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
};

const ShippingPage = () => {
    const { register, handleSubmit, formState, setValue } =
        useForm<FormValues>();
    const { state, dispatch } = useContext(Store);
    const {
        userInfo,
        cart: { shippingAddress },
    } = state;
    const router = useRouter();

    useEffect(() => {
        if (!userInfo) {
            router.push('/login?redirect=/shipping');
        }
        setValue('name', shippingAddress.name);
        setValue('address', shippingAddress.address);
        setValue('city', shippingAddress.city);
        setValue('postalCode', shippingAddress.postalCode);
        setValue('country', shippingAddress.country);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submitHandler = (formData: FormValues) => {
        dispatch({
            type: ActionType.SAVE_SHIPPING_ADDRESS,
            payload: formData,
        });

        Cookies.set('shippingAddress', JSON.stringify(formData));
        router.push('/payment');
    };

    return (
        <DynamicDefaultLayout title='Register'>
            <>
                <div className={styles.wrapper}>
                    <CheckoutWizard activeStep={1} />
                </div>
                <form
                    onSubmit={handleSubmit(submitHandler)}
                    className={styles.form}
                >
                    <h1>Shipping</h1>
                    <div>
                        <label className={styles.lbl}>
                            Name
                            <input
                                type='text'
                                id='name'
                                className={styles.ipt}
                                placeholder='Name'
                                {...register('name', {
                                    required: 'Name is required',
                                })}
                            />
                        </label>
                        {formState?.errors?.name && (
                            <p className={styles.error}>
                                {formState?.errors?.name.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className={styles.lbl}>
                            Address
                            <input
                                type='text'
                                id='address'
                                placeholder='Address'
                                className={styles.ipt}
                                {...register('address', {
                                    required: 'Address is required',
                                })}
                            />
                        </label>
                        {formState?.errors?.address && (
                            <p className={styles.error}>
                                {formState?.errors?.address.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className={styles.lbl}>
                            City
                            <input
                                type='text'
                                id='city'
                                placeholder='City'
                                className={styles.ipt}
                                {...register('city', {
                                    required: 'City is required',
                                })}
                            />
                        </label>
                        {formState?.errors?.city && (
                            <p className={styles.error}>
                                {formState?.errors?.city.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className={styles.lbl}>
                            Postal Code
                            <input
                                type='text'
                                id='postalCode'
                                placeholder='Postal Code'
                                className={styles.ipt}
                                {...register('postalCode', {
                                    required: 'Postal Code is required',
                                })}
                            />
                        </label>
                        {formState?.errors?.postalCode && (
                            <p className={styles.error}>
                                {formState?.errors?.postalCode.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className={styles.lbl}>
                            Coutry
                            <input
                                type='text'
                                id='coutry'
                                placeholder='Coutry'
                                className={styles.ipt}
                                {...register('country', {
                                    required: 'Coutry is required',
                                })}
                            />
                        </label>
                        {formState?.errors?.country && (
                            <p className={styles.error}>
                                {formState?.errors?.country.message}
                            </p>
                        )}
                    </div>
                    <div className={styles.btnContainer}>
                        <Button
                            shadow
                            submit
                            onClickHandler={() => console.log('Continue !')}
                        >
                            Continue
                        </Button>
                    </div>
                </form>
            </>
        </DynamicDefaultLayout>
    );
};

export default ShippingPage;
