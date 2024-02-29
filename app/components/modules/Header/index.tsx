import Link from 'next/link';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { Store, ActionType } from '../../../utils/Store';
import SwitchButton from '../../elements/SwitchButton';
import styles from './Header.module.scss';
import Cookies from 'js-cookie';
import Button from '../../elements/Button';
import { useRouter } from 'next/router';
import { getError } from '../../../utils/error';
import axios from 'axios';
import { toast } from 'react-toastify';
import HamburgerButton from '../../elements/HamburgerButton';

const Header = () => {
    const [active, setActive] = useState(false);
    const { state, dispatch } = useContext(Store);
    const { darkMode, cart, userInfo } = state;
    const router = useRouter();

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // let isMounted = true;
        const fetchCategories = async () => {
            try {
                // if (isMounted) {
                const { data } = await axios.get(`/api/products/categories`);
                setCategories(data);
                // }
            } catch (err) {
                toast.error(getError(err), { theme: 'colored' });
            }
        };

        fetchCategories();
        // return () => {
        //     isMounted = false;
        // };
    }, []);

    const darkModeHandler = () => {
        dispatch({
            type: darkMode ? ActionType.DARK_MODE_OFF : ActionType.DARK_MODE_ON,
        });

        const newDarkMode = !darkMode;
        Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
    };

    const clickHandler = (e: FormEvent, redirect: string) => {
        setActive(false);
        if (redirect) {
            router.push(redirect);
        }
    };

    const logoutHandler = () => {
        dispatch({ type: ActionType.USER_LOGOUT });
        Cookies.remove('userInfo');
        Cookies.remove('cartItems');
        router.push('/');
    };

    const isActive = active ? styles.active : styles.inactive;

    return (
        <div className={styles.headerWrapper}>
            <nav className={styles.header}>
                <HamburgerButton>
                    {categories && (
                        <>
                            <ul className={styles.categories}>
                                {categories.map((category) => (
                                    <li key={category}>
                                        <Link
                                            href={`/search?category=${category}`}
                                        >
                                            <a>{category}</a>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </HamburgerButton>
                <Link href='/'>
                    <a>
                        <div className={styles.logo}>AscentGear</div>
                    </a>
                </Link>
                <div className={styles.right}>
                    <SwitchButton
                        onChangeHandler={darkModeHandler}
                        checked={darkMode}
                    />
                    <Link href='/cart'>
                        <a className={styles.badgeRoot}>
                            {cart.cartItems.length > 0 && (
                                <div className={styles.badge}>
                                    {cart.cartItems.length}
                                </div>
                            )}
                            Cart
                        </a>
                    </Link>
                    {userInfo ? (
                        <div className={styles.dropdown}>
                            <Button onClickHandler={() => setActive(!active)}>
                                {userInfo.name}
                            </Button>
                            <div
                                className={`${styles.dropdownContent} ${isActive}`}
                            >
                                <Button
                                    onClickHandler={(e: FormEvent) =>
                                        clickHandler(e, '/profile')
                                    }
                                >
                                    Profile
                                </Button>
                                <Button
                                    onClickHandler={(e: FormEvent) =>
                                        clickHandler(e, '/order-history')
                                    }
                                >
                                    Order History
                                </Button>
                                {userInfo.isAdmin && (
                                    <Button
                                        onClickHandler={(e: FormEvent) =>
                                            clickHandler(e, '/admin/dashboard')
                                        }
                                    >
                                        Admin Dashboard
                                    </Button>
                                )}
                                <Button onClickHandler={logoutHandler}>
                                    Logout
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Link href='/login'>
                            <a>Login</a>
                        </Link>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Header;
