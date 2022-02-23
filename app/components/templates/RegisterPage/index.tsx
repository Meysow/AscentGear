import { useContext, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { ActionType, Store } from '../../../utils/Store';
import Button from '../../elements/Button';
// import DefaultLayout from '../../layouts/DefaultLayout';
import styles from './RegisterPage.module.scss';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const DynamicDefaultLayout = dynamic(
    () => import('../../layouts/DefaultLayout')
);

type FormValues = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const RegisterPage = () => {
    const { register, handleSubmit, formState } = useForm<FormValues>();
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    const router = useRouter();
    const { redirect }: any = router.query;

    useEffect(() => {
        if (userInfo) {
            router.push('/');
        }
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
            const { data } = await axios.post('/api/users/register', {
                name,
                email,
                password,
            });

            dispatch({ type: ActionType.USER_LOGIN, payload: data });
            Cookies.set('userInfo', JSON.stringify(data));
            router.push(redirect || '/');
        } catch (err: any) {
            toast.error(
                `${
                    err.response.data ? err.response.data.message : err.message
                }`,
                {
                    theme: 'colored',
                }
            );
        }
    };

    return (
        <DynamicDefaultLayout title='Register'>
            <form
                onSubmit={handleSubmit(submitHandler)}
                className={styles.form}
            >
                <h1>Register</h1>
                <div>
                    <label className={styles.lbl}>
                        Name
                        <input
                            type='text'
                            id='name'
                            className={styles.ipt}
                            placeholder='Name'
                            {...register('name', {
                                required: 'Password is required',
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
                                    message: 'Invalid email address',
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
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message:
                                        'Password must contain at least 6 characters',
                                },
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
                                required: 'Confirm Password is required',
                                minLength: {
                                    value: 6,
                                    message:
                                        'Password must contain at least 6 characters',
                                },
                            })}
                        />
                    </label>
                    {formState?.errors?.confirmPassword && (
                        <p className={styles.error}>
                            {formState?.errors?.confirmPassword.message}
                        </p>
                    )}
                </div>
                <div className={styles.btnContainer}>
                    <Button onClickHandler={() => submitHandler}>
                        Register
                    </Button>
                </div>
                <p>
                    Already have an account ?{'  '}
                    <Link href={`/login?redirect=${redirect || '/'}`}>
                        <a className={styles.link}>Login</a>
                    </Link>
                </p>
            </form>
        </DynamicDefaultLayout>
    );
};

export default RegisterPage;
