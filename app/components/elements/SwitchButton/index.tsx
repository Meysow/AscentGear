import styles from './SwitchButton.module.scss';

interface Props {
    onChangeHandler: () => void;
    checked: boolean;
}

const SwitchButton = ({ onChangeHandler, checked }: Props) => {
    return (
        <label className={styles.switch}>
            <input
                type='checkbox'
                onChange={onChangeHandler}
                className={styles['checkbox-input']}
                checked={checked}
            />
            <span className={styles.slider}></span>
        </label>
    );
};

export default SwitchButton;
