import { ReactChild, ReactChildren } from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
    children: ReactChild | ReactChildren;
    fullWidth?: boolean;
    color?: string;
    shadow?: boolean;
    onClickHandler: () => void;
}

const Button = ({
    children,
    fullWidth = false,
    color = 'default',
    shadow = false,
    onClickHandler,
}: ButtonProps) => {
    const btnFull = fullWidth ? styles.fullWidth : '';
    const btnShadow = shadow ? styles.shadow : '';

    return (
        <div
            className={`${styles.btnContainer} ${btnFull} ${btnShadow} ${
                styles[`${color}`]
            }`}
        >
            <button className={styles.btn} onClick={onClickHandler}>
                {children}
            </button>
        </div>
    );
};

export default Button;
