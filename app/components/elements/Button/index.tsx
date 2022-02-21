import { ReactChild, ReactChildren } from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
    children: ReactChild | ReactChildren;
    fullWidth?: boolean;
    color?: string;
    onClickHandler: () => void;
}

const Button = ({
    children,
    fullWidth = false,
    color = 'default',
    onClickHandler,
}: ButtonProps) => {
    const btnFull = fullWidth && 'fullWidth';

    return (
        <div
            className={`${styles.btnContainer} ${styles[`${btnFull}`]} ${
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
