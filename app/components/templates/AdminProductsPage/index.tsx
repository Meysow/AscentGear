import styles from './AdminProductsPage.module.scss';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useContext, useReducer } from 'react';
import { Store } from '../../../utils/Store';
import { getError } from '../../../utils/error';
import Button from '../../elements/Button';
import LoadingSpinner from '../../elements/LoadingSpinner';
import { ProductType } from '../../../../typings';
import { toast } from 'react-toastify';

const DynamicDefaultLayout = dynamic(
    () => import('../../layouts/DefaultLayout'),
    { ssr: false }
);

interface IState {
    loading: boolean;
    products: ProductType[];
    error: string;
    loadingCreate: boolean;
    loadingDelete: boolean;
    successDelete: boolean;
}

const initialState: IState = {
    loading: true,
    products: [],
    error: '',
    loadingCreate: false,
    loadingDelete: false,
    successDelete: false,
};

function reducer(state: IState, action: any) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false,
                products: action.payload,
                error: '',
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'CREATE_REQUEST':
            return { ...state, loadingCreate: true };
        case 'CREATE_SUCCESS':
            return { ...state, loadingCreate: false };
        case 'CREATE_FAIL':
            return { ...state, loadingCreate: false };
        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true };
        case 'DELETE_SUCCESS':
            return { ...state, loadingDelete: false, successDelete: true };
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false };
        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false };
        default:
            return state;
    }
}

const AdminProductsPage = () => {
    const { state } = useContext(Store);
    const router = useRouter();
    const { userInfo } = state;

    const [
        {
            loading,
            error,
            products,
            loadingCreate,
            successDelete,
            loadingDelete,
        },
        dispatch,
    ] = useReducer(reducer, initialState);

    useEffect(() => {
        if (!userInfo) {
            router.push('/login');
        }
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/admin/products`, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        if (successDelete) {
            dispatch({ type: 'DELETE_RESET' });
        } else {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [successDelete]);

    const createHandler = async () => {
        if (!window.confirm('Are you sure?')) {
            return;
        }
        try {
            dispatch({ type: 'CREATE_REQUEST' });
            const { data } = await axios.post(
                `/api/admin/products`,
                {},
                {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch({ type: 'CREATE_SUCCESS' });

            toast.success('Product created successfully', {
                theme: 'colored',
            });
            router.push(`/admin/product/${data.product._id}`);
        } catch (err) {
            dispatch({ type: 'CREATE_FAIL' });
            toast.error(getError(err), {
                theme: 'colored',
            });
        }
    };
    const deleteHandler = async (productId: string) => {
        if (!window.confirm('Are you sure?')) {
            return;
        }
        try {
            dispatch({ type: 'DELETE_REQUEST' });
            await axios.delete(`/api/admin/products/${productId}`, {
                headers: { authorization: `Bearer ${userInfo.token}` },
            });
            dispatch({ type: 'DELETE_SUCCESS' });
            toast.success('Product deleted successfully', {
                theme: 'colored',
            });
        } catch (err) {
            dispatch({ type: 'DELETE_FAIL' });
            toast.error(getError(err), {
                theme: 'colored',
            });
        }
    };

    return (
        <DynamicDefaultLayout title='Admin Products'>
            <>
                <div className={styles.container}>
                    <div className={styles.containerLeft}>
                        <div className={styles.containerLeftButton}>
                            <Button
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
                                selected
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
                        <div className={styles.flexTitle}>
                            <h1>Products</h1>
                            <div>
                                <Button onClickHandler={createHandler}>
                                    Create New
                                </Button>
                                {loadingCreate && <LoadingSpinner />}
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.Id}>ID</div>
                            <div className={styles.Name}>NAME</div>
                            <div className={styles.Price}>PRICE</div>
                            <div className={styles.Category}>CATEGORY</div>
                            <div className={styles.Count}>COUNT</div>
                            <div className={styles.Rating}>RATING</div>
                            <div className={styles.Actions}>ACTIONS</div>
                        </div>

                        {products.map((product: ProductType) => (
                            <div className={styles.row} key={product._id}>
                                <p className={styles.Id}>
                                    {product._id.substring(20, 24)}
                                </p>
                                <p className={styles.Name}>{product.name}</p>
                                <p className={styles.Price}>${product.price}</p>
                                <p className={styles.Category}>
                                    {product.category}
                                </p>
                                <p className={styles.Count}>
                                    {product.countInStock}
                                </p>
                                <p className={styles.Rating}>
                                    {product.rating}
                                </p>
                                <div className={styles.Actions}>
                                    <Button
                                        color='tertiary'
                                        onClickHandler={() =>
                                            router.push(
                                                `/admin/product/${product._id}`
                                            )
                                        }
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        color='danger'
                                        onClickHandler={() =>
                                            deleteHandler(product._id)
                                        }
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        </DynamicDefaultLayout>
    );
};

export default AdminProductsPage;
