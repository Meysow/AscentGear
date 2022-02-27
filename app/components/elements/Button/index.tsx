import { FormEvent, forwardRef, ReactChild, ReactChildren } from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
    children: ReactChild | ReactChildren;
    fullWidth?: boolean;
    color?: string;
    shadow?: boolean;
    selected?: boolean;
    onClickHandler: (() => void) | ((e: FormEvent) => void);
}

const Button = (
    {
        children,
        fullWidth = false,
        color = 'default',
        shadow = false,
        selected = false,
        onClickHandler,
    }: ButtonProps,
    ref: any
) => {
    const btnFull = fullWidth ? styles.fullWidth : '';
    const btnShadow = shadow ? styles.shadow : '';
    const btnSelected = selected ? styles.selected : '';

    return (
        <div
            ref={ref}
            className={`${
                styles.btnContainer
            } ${btnFull} ${btnShadow} ${btnSelected} ${styles[`${color}`]}`}
        >
            <button className={styles.btn} onClick={onClickHandler}>
                {children}
            </button>
        </div>
    );
};

export default forwardRef(Button);
