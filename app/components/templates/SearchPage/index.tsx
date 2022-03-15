import styles from './SearchPage.module.scss';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import ListBox from '../../elements/ListBox';
import SearchBox from '../../elements/SearchBox';
import Cards from '../../modules/Cards';
import Pagination from '../../elements/Pagination';
import { Store } from '../../../utils/Store';

const DynamicDefaultLayout = dynamic(
    () => import('../../layouts/DefaultLayout'),
    { ssr: false }
);

const prices = [
    {
        name: '$1 to $50',
        value: '1-50',
    },
    {
        name: '$51 to $200',
        value: '51-200',
    },
    {
        name: '$201 to $1000',
        value: '201-1000',
    },
];

const ratings = [1, 2, 3, 4, 5];

const PageSize = 3;

const SearchPage = ({ serverProps }: any) => {
    const { products, countProducts, categories, brands, pages } = serverProps;
    const [currentPage, setCurrentPage] = useState(1);
    const { state } = useContext(Store);
    const { darkMode } = state;

    const router = useRouter();
    const {
        query = 'all',
        category = 'all',
        brand = 'all',
        price = 'all',
        rating = 'all',
        sort = 'featured',
    } = router.query;

    const filterSearch = ({
        page,
        category,
        brand,
        sort,
        min,
        max,
        searchQuery,
        price,
        rating,
    }: any) => {
        const path = router.pathname;
        const { query } = router;
        if (page) query.page = page;
        if (searchQuery) query.searchQuery = searchQuery;
        if (sort) query.sort = sort;
        if (category) query.category = category;
        if (brand) query.brand = brand;
        if (price) query.price = price;
        if (rating) query.rating = rating;
        if (min) query.min ? query.min : parseInt(query.min!) === 0 ? 0 : min;
        if (max) query.max ? query.max : parseInt(query.max!) === 0 ? 0 : max;

        router.push({
            pathname: path,
            query: query,
        });
    };

    const categoryHandler = (option: string) => {
        filterSearch({ category: option });
    };
    const brandHandler = (option: string) => {
        filterSearch({ brand: option });
    };
    const priceHandler = (option: any) => {
        filterSearch({ price: option });
    };
    const ratingHandler = (option: number) => {
        filterSearch({ rating: option });
    };
    const pageHandler = (page: number) => {
        filterSearch({ page });
    };
    const sortHandler = (option: string) => {
        filterSearch({ sort: option });
    };

    return (
        <DynamicDefaultLayout title='Search'>
            <>
                <SearchBox />
                <div className={styles.container}>
                    <div className={styles.left}>
                        <div className={styles.filter}>
                            <ListBox
                                title={'Categories'}
                                listItems={categories}
                                onChangeHandler={categoryHandler}
                                value={category}
                            />
                        </div>

                        <div className={styles.filter}>
                            <ListBox
                                title={'Brands'}
                                listItems={brands}
                                onChangeHandler={brandHandler}
                                value={brand}
                            />
                        </div>

                        <div className={styles.filter}>
                            <ListBox
                                title={'Prices'}
                                listItems={prices}
                                onChangeHandler={priceHandler}
                                prices
                                value={price}
                            />
                        </div>

                        <div className={styles.filter}>
                            <ListBox
                                title={'Ratings'}
                                listItems={ratings}
                                onChangeHandler={ratingHandler}
                                ratings
                                value={rating}
                            />
                        </div>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.rightHeader}>
                            <p className={styles.flexOptions}>
                                {' '}
                                {products.length === 0
                                    ? 'No'
                                    : countProducts}{' '}
                                Results
                                {query !== 'all' &&
                                    query !== '' &&
                                    ' : ' + query}
                                {category !== 'all' && ' : ' + category}
                                {brand !== 'all' && ' : ' + brand}
                                {price !== 'all' && ' : Price ' + price}
                                {rating !== 'all' &&
                                    ' : Rating ' + rating + ' & up'}
                                {(query !== 'all' && query !== '') ||
                                category !== 'all' ||
                                brand !== 'all' ||
                                rating !== 'all' ||
                                price !== 'all' ? (
                                    <button
                                        className={styles.btnClose}
                                        onClick={() => {
                                            return router.push('/search');
                                        }}
                                    >
                                        X
                                    </button>
                                ) : null}
                            </p>

                            <div className={styles.flexRight}>
                                <p>Sort By</p>
                                <div className={styles.listBoxContainer}>
                                    <ListBox
                                        listItems={[
                                            'Featured',
                                            'Price: Low to High',
                                            'Price: High to Low',
                                            'Customer Reviews',
                                            'Newest Arrivals',
                                        ]}
                                        onChangeHandler={sortHandler}
                                        sortBox
                                        value={sort}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles.main}>
                            <Cards products={products} />
                        </div>
                        <div>
                            <Pagination
                                currentPage={currentPage}
                                pages={pages}
                                pageSize={PageSize}
                                onPageChange={(page: number) => {
                                    setCurrentPage(page);
                                    pageHandler(page);
                                }}
                                siblingCount={1}
                                className={darkMode && 'darkMode'}
                            />
                        </div>
                    </div>
                </div>
            </>
        </DynamicDefaultLayout>
    );
};

export default SearchPage;
