import { ReactChild, ReactChildren, useState } from 'react';
import styles from './HamburgerButton.module.scss';

const HamburgerButton = (props: any) => {
    const [active, setActive] = useState(false);
    const isActive = active ? styles.active : styles.notActive;

    // function to close the side panel while user click outside of it //
    const onClickOutside = (e: any) => {
        e.preventDefault();
        if (e.target === e.currentTarget) {
            setActive(false);
            return;
        }
        return;
    };

    return (
        <>
            <div className={`${styles.hamburger} ${active && styles.active}`}>
                <div
                    className={`${styles.btn} ${isActive}`}
                    onClick={() => setActive((prev) => !prev)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div
                className={`${styles.main} ${isActive}`}
                onClick={onClickOutside}
            >
                <div className={`${styles.sideBar} ${isActive}`}>
                    <header className={styles.title}>
                        <h3>Shopping by category</h3>
                        <div
                            className={`${styles.btn} ${isActive}`}
                            onClick={() => setActive((prev) => !prev)}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </header>
                    <hr className={styles.separator} />
                    {props.children}
                </div>
            </div>
        </>
    );
};

export default HamburgerButton;
