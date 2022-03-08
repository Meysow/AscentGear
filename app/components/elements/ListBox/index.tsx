import { useState } from 'react';
import { Rating } from 'react-simple-star-rating';
import styles from './ListBox.module.scss';

// defaultValue: string;
// list: Array[]

const ListBox = ({
    title,
    listItems,
    onChangeHandler,
    ratings,
    prices,
    sortBox,
    value = 'all',
}: any) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggling = () => setIsOpen((prev) => !prev);

    const onOptionClicked = (optionValue: any) => () => {
        onChangeHandler(optionValue);
        setIsOpen(false);
    };

    // function to close the side panel while user click outside of it //
    const onClickOutside = (e: any) => {
        e.preventDefault();
        if (e.target === e.currentTarget) {
            setIsOpen(false);
            return;
        }
        return;
    };

    if (ratings) {
        return (
            <div className={styles.container}>
                {title && (
                    <p className={styles.title} onClick={toggling}>
                        {title}
                    </p>
                )}

                <label
                    className={title ? styles.lbl : styles.lblWithoutTitle}
                    onClick={toggling}
                >
                    {value === 'all' ? (
                        'All'
                    ) : (
                        <>
                            <Rating
                                ratingValue={parseInt(value) * 20}
                                readonly
                                allowHalfIcon
                                size={18}
                            />
                            <span> and up</span>
                        </>
                    )}
                </label>

                {isOpen && (
                    <div className={styles.listWrapper}>
                        <ul className={styles.list}>
                            <li
                                onClick={onOptionClicked('all')}
                                className={styles.item}
                            >
                                All
                            </li>
                            {listItems.map((item: number) => (
                                <li
                                    key={item}
                                    onClick={onOptionClicked(item)}
                                    className={styles.item}
                                >
                                    <Rating
                                        ratingValue={item * 20}
                                        readonly
                                        allowHalfIcon
                                        size={18}
                                    />
                                    <span> and up</span>
                                </li>
                            ))}
                        </ul>
                        <div
                            className={styles.clickOutside}
                            onClick={onClickOutside}
                        ></div>
                    </div>
                )}
            </div>
        );
    } else if (prices) {
        return (
            <div className={styles.container}>
                {title && (
                    <p className={styles.title} onClick={toggling}>
                        {title}
                    </p>
                )}
                <label
                    className={title ? styles.lbl : styles.lblWithoutTitle}
                    onClick={toggling}
                >
                    {value === 'all'
                        ? 'All'
                        : listItems?.filter(
                              (item: any) => item.value === value
                          )[0].name}
                </label>

                {isOpen && (
                    <div className={styles.listWrapper}>
                        <ul className={styles.list}>
                            <li
                                onClick={onOptionClicked('all')}
                                className={styles.item}
                            >
                                All
                            </li>
                            {listItems.map((item: any) => (
                                <li
                                    key={item.value}
                                    onClick={onOptionClicked(item.value)}
                                    className={styles.item}
                                >
                                    {item.name}
                                </li>
                            ))}
                        </ul>
                        <div
                            className={styles.clickOutside}
                            onClick={onClickOutside}
                        ></div>
                    </div>
                )}
            </div>
        );
    } else {
        return (
            <div className={styles.container}>
                {title && (
                    <p className={styles.title} onClick={toggling}>
                        {title}
                    </p>
                )}
                <label
                    className={title ? styles.lbl : styles.lblWithoutTitle}
                    onClick={toggling}
                >
                    {value === 'all' ? 'All' : value}
                </label>

                {isOpen && (
                    <div className={styles.listWrapper}>
                        <ul className={styles.list}>
                            {!sortBox && (
                                <li
                                    onClick={onOptionClicked('all')}
                                    className={styles.item}
                                >
                                    All
                                </li>
                            )}
                            {listItems.map((item: any) => (
                                <li
                                    key={item}
                                    onClick={onOptionClicked(item)}
                                    className={styles.item}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <div
                            className={styles.clickOutside}
                            onClick={onClickOutside}
                        ></div>
                    </div>
                )}
            </div>
        );
    }
};

export default ListBox;
