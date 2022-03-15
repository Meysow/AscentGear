import React, { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';

import styles from './Carousel.module.scss';

export const CarouselItem = ({ children, width }: any) => {
    return (
        <div className={styles.carouselItem} style={{ width: width }}>
            {children}
        </div>
    );
};

const Carousel = ({ children }: any) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    const updateIndex = (newIndex: number) => {
        if (newIndex < 0) {
            newIndex = React.Children.count(children) - 1;
        } else if (newIndex >= React.Children.count(children)) {
            newIndex = 0;
        }

        setActiveIndex(newIndex);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (!paused) {
                updateIndex(activeIndex + 1);
            }
        }, 5000);

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    });

    const handlers = useSwipeable({
        onSwipedLeft: () => updateIndex(activeIndex + 1),
        onSwipedRight: () => updateIndex(activeIndex - 1),
    });

    return (
        <div
            {...handlers}
            className={styles.carousel}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div
                className={styles.inner}
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
                {React.Children.map(children, (child, index) => {
                    return React.cloneElement(child, { width: '100%' });
                })}
            </div>
            <div className={styles.indicators}>
                {/* <button
                    onClick={() => {
                        updateIndex(activeIndex - 1);
                    }}
                >
                    Prev
                </button> */}
                {React.Children.map(children, (child, index) => {
                    return (
                        <button
                            className={`${
                                index === activeIndex && styles.active
                            }`}
                            onClick={() => {
                                updateIndex(index);
                            }}
                        ></button>
                    );
                })}
                {/* <button
                    onClick={() => {
                        updateIndex(activeIndex + 1);
                    }}
                >
                    Next
                </button> */}
            </div>
        </div>
    );
};

export default Carousel;
