import React from 'react';
import { usePagination, DOTS } from '../../../utils/hooks/usePagination';

import styles from './Pagination.module.scss';

interface Props {
    onPageChange: any;
    pages: number;
    siblingCount: number;
    currentPage: number;
    pageSize: number;
    className: string | boolean;
}

const Pagination = (props: Props) => {
    const {
        onPageChange,
        pages,
        siblingCount = 1,
        currentPage,
        pageSize,
        className,
    } = props;

    const paginationRange = usePagination({
        currentPage,
        pages,
        siblingCount,
        pageSize,
    });

    if (currentPage === 0 || paginationRange.length < 1) {
        return null;
    }

    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    let lastPage = paginationRange[paginationRange.length - 1];

    console.log(className, 'className');

    return (
        <ul
            className={`${styles.paginationContainer} ${
                className && styles[`${className}`]
            }`}
        >
            <li
                className={`${styles.paginationItem} ${
                    currentPage === 1 && styles.disabled
                }`}
                onClick={onPrevious}
            >
                <div className={`${styles.arrow} ${styles.left}`} />
            </li>
            {paginationRange.map((pageNumber: number | typeof DOTS) => {
                if (pageNumber === DOTS) {
                    return (
                        <li
                            className={`${styles.paginationItem} ${styles.dots}`}
                        >
                            &#8230;
                        </li>
                    );
                }

                return (
                    <li
                        className={`${styles.paginationItem} ${
                            pageNumber === currentPage && styles.selected
                        }`}
                        onClick={() => onPageChange(pageNumber)}
                        key={pageNumber}
                    >
                        {pageNumber}
                    </li>
                );
            })}
            <li
                className={`${styles.paginationItem} ${
                    currentPage === lastPage && styles.disabled
                }`}
                onClick={onNext}
            >
                <div className={`${styles.arrow} ${styles.right}`} />
            </li>
        </ul>
    );
};

export default Pagination;
