import { useContext, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { ActionType, Store } from '../../../utils/Store';
import Button from '../../elements/Button';
import styles from './LoginPage.module.scss';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getError } from '../../../utils/error';

const DynamicDefaultLayout = dynamic(
    () => import('../../layouts/DefaultLayout'),
    { ssr: false }
);

type FormValues = {
    email: string;
    password: string;
};

const LoginPage = () => {
    const { register, handleSubmit, formState } = useForm<FormValues>();
    const { state, dispatch } = useContext(Store);
    const { userInfo, darkMode } = state;
    const router = useRouter();
    const { redirect }: any = router.query;

    useEffect(() => {
        if (userInfo) {
            router.push('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submitHandler: SubmitHandler<FormValues> = async (
        formData: FormValues
    ) => {
        toast.dismiss();
        const { email, password } = formData;
        try {
            const { data } = await axios.post('/api/users/login', {
                email,
                password,
            });

            dispatch({ type: ActionType.USER_LOGIN, payload: data });
            Cookies.set('userInfo', JSON.stringify(data));
            router.push(redirect || '/');
        } catch (err: any) {
            toast.error(`${getError(err)}`, {
                theme: 'colored',
            });
        }
    };

    return (
        <DynamicDefaultLayout>
            <form
                onSubmit={handleSubmit(submitHandler)}
                className={`${styles.form} ${darkMode && styles.darkMode}`}
            >
                <h1>Login</h1>
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
                <div className={styles.btnContainer}>
                    <Button
                        shadow
                        submit
                        onClickHandler={() => console.log('Submit Login')}
                    >
                        Login
                    </Button>
                </div>
                <p>
                    Don&apos;t have an Account ?{'  '}
                    <Link href={`/register?redirect=${redirect || '/'}`}>
                        <a className={styles.link}>Register</a>
                    </Link>
                </p>
            </form>
        </DynamicDefaultLayout>
    );
};

export default LoginPage;
