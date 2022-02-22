import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { ActionType, Store } from '../../../utils/Store';
import Button from '../../elements/Button';
// import DefaultLayout from '../../layouts/DefaultLayout';
import styles from './LoginPage.module.scss';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';

const DynamicDefaultLayout = dynamic(
    () => import('../../layouts/DefaultLayout')
);

const LoginPage = () => {
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    const router = useRouter();
    const { redirect }: any = router.query;

    useEffect(() => {
        if (userInfo) {
            router.push('/');
        }
    }, []);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/users/login', {
                email,
                password,
            });

            dispatch({ type: ActionType.USER_LOGIN, payload: data });
            Cookies.set('userInfo', JSON.stringify(data));
            router.push(redirect || '/');
        } catch (err: any) {
            alert(err.response.data ? err.response.data.message : err.message);
        }
    };

    return (
        <DynamicDefaultLayout>
            <form onSubmit={submitHandler} className={styles.form}>
                <h1>Login</h1>
                <div>
                    <label className={styles.lbl}>
                        Email
                        <input
                            type='text'
                            name='email'
                            id='email'
                            className={styles.ipt}
                            placeholder='Email'
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </label>
                </div>
                <div>
                    <label className={styles.lbl}>
                        Password
                        <input
                            type='text'
                            name='password'
                            id='password'
                            className={styles.ipt}
                            placeholder='Password'
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </label>
                </div>
                <div className={styles.btnContainer}>
                    <Button onClickHandler={() => console.log('login')}>
                        Login
                    </Button>
                </div>
                <p>
                    Don&apos;t have an Account ?{'  '}
                    <Link href='/register'>
                        <a className={styles.link}>Register</a>
                    </Link>
                </p>
            </form>
        </DynamicDefaultLayout>
    );
};

export default LoginPage;
