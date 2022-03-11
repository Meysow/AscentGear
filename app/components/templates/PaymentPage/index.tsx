import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import styles from './PaymentPage.module.scss';
import { useContext, useEffect } from 'react';
import { ActionType, Store } from '../../../utils/Store';
import CheckoutWizard from '../../elements/CheckoutWizard';
import { useForm } from 'react-hook-form';
import Button from '../../elements/Button';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';

const DefaultLayout = dynamic(() => import('../../layouts/DefaultLayout'), {
    ssr: false,
});

type FormValues = {
    paymentMethod: string;
};

const PaymentPage = () => {
    const { register, handleSubmit, setValue } = useForm<FormValues>();

    const router = useRouter();
    const { state, dispatch } = useContext(Store);
    const {
        cart: { shippingAddress, paymentMethod },
        darkMode,
    } = state;

    useEffect(() => {
        if (!shippingAddress.address) {
            router.push('/shipping');
        } else {
            setValue('paymentMethod', paymentMethod);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submitHandler = (formData: FormValues) => {
        toast.dismiss();
        if (!formData.paymentMethod) {
            toast.error(`Please Choose a Payment Method`, {
                theme: 'colored',
            });
        } else {
            dispatch({
                type: ActionType.SAVE_PAYMENT_METHOD,
                payload: formData.paymentMethod,
            });
            Cookies.set(
                'paymentMethod',
                JSON.stringify(formData.paymentMethod)
            );
            router.push('/placeorder');
        }
    };

    return (
        <DefaultLayout title='Payment Method'>
            <>
                <div className={styles.wrapper}>
                    <CheckoutWizard activeStep={2} />
                </div>
                <form
                    className={`${styles.form} ${darkMode && styles.darkMode}`}
                    onSubmit={handleSubmit(submitHandler)}
                >
                    <h1>Payment Method</h1>
                    <label className={styles.label}>
                        <input
                            className={styles.input}
                            type='radio'
                            value='Paypal'
                            {...register('paymentMethod')}
                        />
                        <span className={styles.span}>Paypal</span>
                    </label>
                    <label className={styles.label}>
                        <input
                            className={styles.input}
                            type='radio'
                            value='Stripe'
                            {...register('paymentMethod')}
                        />

                        <span className={styles.span}>Stripe</span>
                    </label>
                    <label className={styles.label}>
                        <input
                            className={styles.input}
                            type='radio'
                            value='Cash'
                            {...register('paymentMethod')}
                        />

                        <span className={styles.span}>Cash</span>
                    </label>
                    <div className={styles.btnContainer}>
                        <Button
                            submit
                            shadow
                            onClickHandler={() => console.log('continue')}
                        >
                            Continue
                        </Button>
                    </div>
                    <div className={styles.btnContainer}>
                        <Button
                            submit
                            shadow
                            color='tertiary'
                            onClickHandler={() => router.push('/shipping')}
                        >
                            Back
                        </Button>
                    </div>
                </form>
            </>
        </DefaultLayout>
    );
};

export default PaymentPage;
