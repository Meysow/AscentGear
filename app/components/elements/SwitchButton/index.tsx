import styles from './SwitchButton.module.scss';

const SwitchButton = ({ darkModeHandler }: any) => {
    return (
        <label className={styles.switch}>
            <input
                type='checkbox'
                onChange={darkModeHandler}
                className={styles['checkbox-input']}
            />
            <span className={styles.slider}></span>
        </label>
    );
};

export default SwitchButton;
