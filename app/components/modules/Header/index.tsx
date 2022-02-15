import Link from 'next/link';
import { useContext } from 'react';
import { Store, ThemeActionType } from '../../../utils/Store';
import SwitchButton from '../../elements/SwitchButton';
import styles from './Header.module.scss';
import Cookies from 'js-cookie';

const Header = () => {
    const { state, dispatch } = useContext(Store);
    const { darkMode } = state;

    const darkModeHandler = () => {
        dispatch({
            type: darkMode
                ? ThemeActionType.DARK_MODE_OFF
                : ThemeActionType.DARK_MODE_ON,
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
                <SwitchButton darkModeHandler={darkModeHandler} />
                <Link href='/cart'>
                    <a>Cart</a>
                </Link>
                <Link href='/login'>
                    <a>Login</a>
                </Link>
            </div>
        </nav>
    );
};

export default Header;
