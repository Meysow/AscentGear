import Link from 'next/link';
import Button from '../../elements/Button';
import DefaultLayout from '../../layouts/DefaultLayout';
import styles from './LoginPage.module.scss';

const LoginPage = () => {
    return (
        <DefaultLayout>
            <form className={styles.form}>
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
        </DefaultLayout>
    );
};

export default LoginPage;
