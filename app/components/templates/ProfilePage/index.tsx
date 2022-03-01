import axios from 'axios';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getError } from '../../../utils/error';
import { ActionType, Store } from '../../../utils/Store';
import Button from '../../elements/Button';
import styles from './ProfilePage.module.scss';
const DynamicDefaultLayout = dynamic(
    () => import('../../layouts/DefaultLayout')
);

type FormValues = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const ProfilePage = () => {
    const router = useRouter();
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    const { register, handleSubmit, formState, setValue } =
        useForm<FormValues>();

    useEffect(() => {
        if (!userInfo) {
            router.push('/login');
            return;
        }
        setValue('name', userInfo.name);
        setValue('email', userInfo.email);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submitHandler = async (formData: FormValues) => {
        const { name, email, password, confirmPassword } = formData;
        if (password !== confirmPassword) {
            toast.error(`Passwords don't match`, {
                theme: 'colored',
            });
            return;
        }
        try {
            const { data } = await axios.put(
                '/api/users/profile',
                {
                    name,
                    email,
                    password,
                },
                { headers: { authorization: `Bearer ${userInfo.token}` } }
            );

            dispatch({ type: ActionType.USER_LOGIN, payload: data });
            Cookies.set('userInfo', JSON.stringify(data));
            toast.success(`Profile updated successfully`, {
                theme: 'colored',
            });
        } catch (err: any) {
            toast.error(`${getError(err)}`, {
                theme: 'colored',
            });
        }
    };

    return (
        <DynamicDefaultLayout title={`Profile`}>
            <>
                <div className={styles.container}>
                    <div className={styles.containerLeft}>
                        <div className={styles.containerLeftButton}>
                            <Button
                                color='tertiary'
                                onClickHandler={() => router.push('/profile')}
                                selected
                            >
                                User Profile
                            </Button>

                            <Button
                                color='tertiary'
                                onClickHandler={() =>
                                    router.push('/order-history')
                                }
                            >
                                Order History
                            </Button>
                        </div>
                    </div>
                    <div className={styles.containerRight}>
                        <h1>Profile</h1>
                        <form
                            onSubmit={handleSubmit(submitHandler)}
                            className={styles.form}
                        >
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
                                    Email
                                    <input
                                        type='email'
                                        id='email'
                                        placeholder='Email'
                                        className={styles.ipt}
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                                message:
                                                    'Invalid email address',
                                            },
                                        })}
                                    />
                                </label>
                                {formState?.errors?.email && (
                                    <p className={styles.error}>
                                        {formState?.errors?.email.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className={styles.lbl}>
                                    Password
                                    <input
                                        type='password'
                                        id='password'
                                        placeholder='Password'
                                        className={styles.ipt}
                                        {...register('password', {
                                            validate: (value) =>
                                                value === '' ||
                                                value.length > 5 ||
                                                'Password length is more than 5',
                                        })}
                                    />
                                </label>
                                {formState?.errors?.password && (
                                    <p className={styles.error}>
                                        {formState?.errors?.password.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className={styles.lbl}>
                                    Confirm Password
                                    <input
                                        type='password'
                                        id='confirmPassword'
                                        placeholder='Confirm Password'
                                        className={styles.ipt}
                                        {...register('confirmPassword', {
                                            validate: (value) =>
                                                value === '' ||
                                                value.length > 5 ||
                                                'Confirm Password length is more than 5',
                                        })}
                                    />
                                </label>
                                {formState?.errors?.confirmPassword && (
                                    <p className={styles.error}>
                                        {
                                            formState?.errors?.confirmPassword
                                                .message
                                        }
                                    </p>
                                )}
                            </div>
                            <div className={styles.btnContainer}>
                                <Button onClickHandler={() => submitHandler}>
                                    Update Profile
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        </DynamicDefaultLayout>
    );
};

export default ProfilePage;
