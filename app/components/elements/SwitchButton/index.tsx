import styles from './SwitchButton.module.scss';

interface Props {
    darkModeHandler: () => void;
    checked: boolean;
}

const SwitchButton = ({ darkModeHandler, checked }: Props) => {
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
