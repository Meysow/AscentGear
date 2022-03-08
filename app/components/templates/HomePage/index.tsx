import styles from './HomePage.module.scss';
import Cards from '../../modules/Cards';
import { ProductArray } from '../../../../typings';
import SearchBox from '../../elements/SearchBox';

const HomePage = ({ products }: ProductArray) => (
    <main className={styles.content}>
        <SearchBox />
        <h2 className={styles.title}>Products</h2>
        <Cards products={products} />
    </main>
);

export default HomePage;
