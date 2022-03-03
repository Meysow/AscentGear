import styles from './AdminDashboardPage.module.scss';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { useEffect, useContext, useReducer } from 'react';
import { Bar } from 'react-chartjs-2';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     BarElement,
// } from 'chart.js';
import { Store } from '../../../utils/Store';
import { getError } from '../../../utils/error';
import Button from '../../elements/Button';
import LoadingSpinner from '../../elements/LoadingSpinner';

// ChartJS.register(CategoryScale, LinearScale, BarElement);

const DynamicDefaultLayout = dynamic(
    () => import('../../layouts/DefaultLayout')
);

interface IState {
    loading: boolean;
    summary: any;
    error: string;
}

const initialState: IState = {
    loading: true,
    summary: { salesData: [] },
    error: '',
};

function reducer(state: IState, action: any): IState {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false,
                summary: action.payload,
                error: '',
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

const AdminDashboardPage = () => {
    const { state } = useContext(Store);
    const router = useRouter();
    const { userInfo } = state;

    const [{ loading, error, summary }, dispatch] = useReducer(
        reducer,
        initialState
    );

    useEffect(() => {
        if (!userInfo) {
            router.push('/login');
        }
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/admin/summary`, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <DynamicDefaultLayout title='Admin Dashboard'>
            <>
                <div className={styles.container}>
                    <div className={styles.containerLeft}>
                        <div className={styles.containerLeftButton}>
                            <Button
                                selected
                                color='tertiary'
                                onClickHandler={() =>
                                    router.push('/admin/dashboard')
                                }
                            >
                                DashBoard
                            </Button>

                            <Button
                                color='tertiary'
                                onClickHandler={() =>
                                    router.push('/admin/orders')
                                }
                            >
                                Orders
                            </Button>

                            <Button
                                color='tertiary'
                                onClickHandler={() =>
                                    router.push('/admin/products')
                                }
                            >
                                Products
                            </Button>

                            <Button
                                color='tertiary'
                                onClickHandler={() =>
                                    router.push('/admin/users')
                                }
                            >
                                Users
                            </Button>
                        </div>
                    </div>
                    <div className={styles.containerRight}>
                        <h1>Dashboard</h1>
                        {loading ? (
                            <LoadingSpinner />
                        ) : error ? (
                            <p className={styles.error}>{error}</p>
                        ) : (
                            <>
                                <div className={styles.row}>
                                    <Link href='/admin/orders'>
                                        <a>
                                            <div className={styles.item}>
                                                <h2>${summary.ordersPrice}</h2>
                                                <p>Sales</p>
                                                <p>View sales</p>
                                            </div>
                                        </a>
                                    </Link>
                                    <Link href='/admin/orders'>
                                        <a>
                                            <div className={styles.item}>
                                                <h2>{summary.ordersCount}</h2>
                                                <p>Orders</p>
                                                <p>View orders</p>
                                            </div>
                                        </a>
                                    </Link>
                                    <Link href='/admin/products'>
                                        <a>
                                            <div className={styles.item}>
                                                <h2>{summary.productsCount}</h2>
                                                <p>Products</p>
                                                <p>View products</p>
                                            </div>
                                        </a>
                                    </Link>
                                    <Link href='/admin/users'>
                                        <a>
                                            <div className={styles.item}>
                                                <h2>{summary.usersCount}</h2>
                                                <p>Users</p>
                                                <p>View users</p>
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                                <div className={styles.main}>
                                    <h2>Sales Chart</h2>
                                    <div>
                                        <Bar
                                            data={{
                                                labels: summary.salesData.map(
                                                    (x: any) => x._id
                                                ),
                                                datasets: [
                                                    {
                                                        label: 'Sales',
                                                        backgroundColor:
                                                            'rgba(162, 222, 208, 1)',
                                                        data: summary.salesData.map(
                                                            (x: any) =>
                                                                x.totalSales
                                                        ),
                                                    },
                                                ],
                                            }}
                                            options={{
                                                plugins: {
                                                    legend: {
                                                        display: true,
                                                        position: 'right',
                                                    },
                                                },
                                            }}
                                        ></Bar>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </>
        </DynamicDefaultLayout>
    );
};

export default AdminDashboardPage;
