import Link from 'next/link';
import { useContext } from 'react';
import { Store, ActionType } from '../../../utils/Store';
import SwitchButton from '../../elements/SwitchButton';
import styles from './Header.module.scss';
import Cookies from 'js-cookie';

const Header = () => {
    const { state, dispatch } = useContext(Store);
    const { darkMode, cart } = state;

    const darkModeHandler = () => {
        dispatch({
            type: darkMode ? ActionType.DARK_MODE_OFF : ActionType.DARK_MODE_ON,
        });

        const newDarkMode = !darkMode;
        Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
    };

    return (
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
                <Link href='/login'>
                    <a>Login</a>
                </Link>
            </div>
        </nav>
    );
};

export default Header;
