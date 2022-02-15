import styles from './HomePage.module.scss';
import Cards from '../../elements/Cards';

const HomePage = () => (
    <main className={styles.content}>
        <h2 className={styles.title}>Products</h2>
        <Cards />
    </main>
);

export default HomePage;
