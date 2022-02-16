import styles from './SwitchButton.module.scss';

const SwitchButton = ({ darkModeHandler, checked }: any) => {
    return (
        <label className={styles.switch}>
            <input
                type='checkbox'
                onChange={darkModeHandler}
                className={styles['checkbox-input']}
                checked={checked}
            />
            <span className={styles.slider}></span>
        </label>
    );
};

export default SwitchButton;
