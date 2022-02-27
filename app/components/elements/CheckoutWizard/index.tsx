import { useRouter } from 'next/router';
import styles from './CheckoutWizard.module.scss';

interface Props {
    activeStep: number;
}

const CheckoutWizard = ({ activeStep = 0 }: Props) => {
    const router = useRouter();
    const steps: string[] = [
        'Login',
        'Shipping Address',
        'Payment Method',
        'Place Order',
    ];
    const variant = (index: number) => {
        if (index === activeStep) {
            return styles.current;
        }
        return index < activeStep ? styles.active : '';
    };
    const clickHandler = (index: number) => {
        if (index === 0) {
            router.push('/login');
        }
        if (index === 1) {
            router.push('/shipping');
        }
        if (index === 2) {
            router.push('/payment');
        }
    };

    return (
        <ol className={styles.stepper}>
            {steps.map((step, i) => (
                <li
                    className={`${styles.stepperItem} ${variant(i)}`}
                    key={step}
                >
                    {i < activeStep ? (
                        <span
                            className={styles.stepperNumber}
                            onClick={() => clickHandler(i)}
                        >
                            {i < activeStep ? '✔' : i + 1}
                        </span>
                    ) : (
                        <span className={styles.stepperNumber}>
                            {i < activeStep ? '✔' : i + 1}
                        </span>
                    )}
                    <p className={styles.stepperTitle}>{step}</p>
                </li>
            ))}
        </ol>
    );
};

export default CheckoutWizard;
