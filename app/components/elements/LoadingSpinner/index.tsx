import styles from './LoadingSpinner.module.scss';

interface Props {
    dark?: boolean;
}

const LoadingSpinner = ({ dark }: Props) => {
    return (
        <div className={`${styles.ldsDefault} ${dark ? styles.dark : ''}`}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};

export default LoadingSpinner;
