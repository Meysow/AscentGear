import styles from './HomePage.module.scss';
import Cards from '../../elements/Cards';
import { ProductArray } from '../../../../typings';

const HomePage = ({ products }: ProductArray) => (
    <main className={styles.content}>
        <h2 className={styles.title}>Products</h2>
        <Cards products={products} />
    </main>
);

export default HomePage;
