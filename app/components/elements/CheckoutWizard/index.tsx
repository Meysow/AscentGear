import styles from './CheckoutWizard.module.scss';

interface Props {
    activeStep: number;
}

const CheckoutWizard = ({ activeStep = 0 }: Props) => {
    const steps: string[] = [
        'Login',
        'Shipping Address',
        'Payment Method',
        'Place Order',
    ];
    const variant = (index: number) =>
        index < activeStep ? styles.active : styles.inactive;

    return (
        <ol className={styles.stepper}>
            {steps.map((step, i) => (
                <li
                    className={`${styles.stepperItem} ${variant(i)}`}
                    key={step}
                >
                    <span className={styles.stepperNumber}>
                        {i < activeStep ? '✔' : i + 1}
                    </span>
                    <p className={styles.stepperTitle}>{step}</p>
                </li>
            ))}
        </ol>
    );
};

export default CheckoutWizard;
