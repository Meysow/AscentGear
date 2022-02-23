import Link from 'next/link';
import { useContext, useState } from 'react';
import { Store, ActionType } from '../../../utils/Store';
import SwitchButton from '../../elements/SwitchButton';
import styles from './Header.module.scss';
import Cookies from 'js-cookie';
import Button from '../../elements/Button';
import { useRouter } from 'next/router';

const Header = () => {
    const [active, setActive] = useState(false);
    const { state, dispatch } = useContext(Store);
    const { darkMode, cart, userInfo } = state;
    const router = useRouter();

    const darkModeHandler = () => {
        dispatch({
            type: darkMode ? ActionType.DARK_MODE_OFF : ActionType.DARK_MODE_ON,
        });

        const newDarkMode = !darkMode;
        Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
    };

    const logoutHandler = () => {
        setActive(false);
        dispatch({ type: ActionType.USER_LOGOUT });
        Cookies.remove('userInfo');
        Cookies.remove('cartItems');
        router.push('/');
    };

    return (
        <div className={styles.headerWrapper}>
            <nav className={styles.header}>
                <Link href='/'>
                    <a>
                        <div className={styles.logo}>Amazona</div>
                    </a>
                </Link>
                <div className={styles.right}>
                    <SwitchButton
                        darkModeHandler={darkModeHandler}
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
                                className={`${styles.dropdownContent} ${
                                    styles[`${active ? 'active' : 'inactive'}`]
                                }`}
                            >
                                <Button onClickHandler={() => setActive(false)}>
                                    Profile
                                </Button>
                                <Button onClickHandler={() => setActive(false)}>
                                    My account
                                </Button>
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
