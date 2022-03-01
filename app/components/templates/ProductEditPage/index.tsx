import styles from './ProductEditPage.module.scss';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useContext, useReducer } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Store } from '../../../utils/Store';
import { getError } from '../../../utils/error';
import Button from '../../elements/Button';
import LoadingSpinner from '../../elements/LoadingSpinner';
import { ProductType } from '../../../../typings';

const DynamicDefaultLayout = dynamic(
    () => import('../../layouts/DefaultLayout')
);

interface IState {
    loading: boolean;
    error: string;
    loadingUpdate: boolean;
}

const initialState: IState = {
    loading: true,
    error: '',
    loadingUpdate: false,
};

function reducer(state: IState, action: any) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true, errorUpdate: '' };
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false, errorUpdate: '' };
        case 'UPDATE_FAIL':
            return {
                ...state,
                loadingUpdate: false,
                errorUpdate: action.payload,
            };

        default:
            return state;
    }
}

interface Props {
    params: {
        id: string;
    };
}

const ProductEditPage = ({ params }: Props) => {
    const productId = params.id;
    const { state } = useContext(Store);
    const [{ loading, error, loadingUpdate }, dispatch] = useReducer(
        reducer,
        initialState
    );
    const { register, handleSubmit, formState, setValue } = useForm();
    const router = useRouter();
    const { userInfo } = state;

    useEffect(() => {
        if (!userInfo) {
            router.push('/login');
            return;
        } else {
            const fetchData = async () => {
                try {
                    dispatch({ type: 'FETCH_REQUEST' });
                    const { data } = await axios.get(
                        `/api/admin/products/${productId}`,
                        {
                            headers: {
                                authorization: `Bearer ${userInfo.token}`,
                            },
                        }
                    );
                    dispatch({ type: 'FETCH_SUCCESS' });
                    setValue('name', data.name);
                    setValue('slug', data.slug);
                    setValue('price', data.price);
                    setValue('image', data.image);
                    setValue('category', data.category);
                    setValue('brand', data.brand);
                    setValue('countInStock', data.countInStock);
                    setValue('description', data.description);
                } catch (err) {
                    dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
                }
            };
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submitHandler = async ({
        name,
        slug,
        price,
        category,
        image,
        brand,
        countInStock,
        description,
    }: any) => {
        toast.dismiss();
        try {
            dispatch({ type: 'UPDATE_REQUEST' });
            await axios.put(
                `/api/admin/products/${productId}`,
                {
                    name,
                    slug,
                    price,
                    category,
                    image,
                    brand,
                    countInStock,
                    description,
                },
                { headers: { authorization: `Bearer ${userInfo.token}` } }
            );
            dispatch({ type: 'UPDATE_SUCCESS' });
            toast.success('Product updated successfully', {
                theme: 'colored',
            });
            router.push('/admin/products');
        } catch (err) {
            dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
            toast.error(getError(err), {
                theme: 'colored',
            });
        }
    };
    return (
        <DynamicDefaultLayout title={`Edit Product ${productId}`}>
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
                            onClickHandler={() => router.push('/admin/orders')}
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
                    </div>
                </div>
                <div className={styles.containerRight}>
                    <h1>Edit Product {productId}</h1>

                    {loading && <LoadingSpinner />}
                    {error && <p className={styles.error}>{error}</p>}
                    <form
                        onSubmit={handleSubmit(submitHandler)}
                        className={styles.form}
                    >
                        <div>
                            <label className={styles.lbl}>
                                Name
                                <input
                                    type='text'
                                    id='name'
                                    className={styles.ipt}
                                    placeholder='Name'
                                    {...register('name', {
                                        required: 'Name is required',
                                    })}
                                />
                            </label>
                            {formState?.errors?.name && (
                                <p className={styles.error}>
                                    {formState?.errors?.name.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className={styles.lbl}>
                                Slug
                                <input
                                    type='text'
                                    id='slug'
                                    placeholder='slug'
                                    className={styles.ipt}
                                    {...register('slug', {
                                        required: 'Slug is required',
                                    })}
                                />
                            </label>
                            {formState?.errors?.slug && (
                                <p className={styles.error}>
                                    {formState?.errors?.slug.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className={styles.lbl}>
                                Price
                                <input
                                    type='text'
                                    id='price'
                                    placeholder='Price'
                                    className={styles.ipt}
                                    {...register('price', {
                                        required: 'Price is required',
                                    })}
                                />
                            </label>
                            {formState?.errors?.price && (
                                <p className={styles.error}>
                                    {formState?.errors?.price.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className={styles.lbl}>
                                Image
                                <input
                                    type='image'
                                    id='image'
                                    className={styles.ipt}
                                    {...register('image', {
                                        required: 'Image is required',
                                    })}
                                />
                            </label>
                            {formState?.errors?.image && (
                                <p className={styles.error}>
                                    {formState?.errors?.image.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className={styles.lbl}>
                                Category
                                <input
                                    type='text'
                                    id='category'
                                    placeholder='Category'
                                    className={styles.ipt}
                                    {...register('category', {
                                        required: 'Category is required',
                                    })}
                                />
                            </label>
                            {formState?.errors?.category && (
                                <p className={styles.error}>
                                    {formState?.errors?.category.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className={styles.lbl}>
                                Brand
                                <input
                                    type='text'
                                    id='brand'
                                    placeholder='Brand'
                                    className={styles.ipt}
                                    {...register('brand', {
                                        required: 'Brand is required',
                                    })}
                                />
                            </label>
                            {formState?.errors?.brand && (
                                <p className={styles.error}>
                                    {formState?.errors?.brand.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className={styles.lbl}>
                                CountInStock
                                <input
                                    type='number'
                                    id='countInStock'
                                    placeholder='CountInStock'
                                    className={styles.ipt}
                                    {...register('countInStock', {
                                        required: 'CountInStock is required',
                                    })}
                                />
                            </label>
                            {formState?.errors?.countInStock && (
                                <p className={styles.error}>
                                    {formState?.errors?.countInStock.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className={styles.lbl}>
                                Description
                                <input
                                    type='text'
                                    id='description'
                                    placeholder='Description'
                                    className={styles.ipt}
                                    {...register('description', {
                                        required: 'Description is required',
                                    })}
                                />
                            </label>
                            {formState?.errors?.description && (
                                <p className={styles.error}>
                                    {formState?.errors?.description.message}
                                </p>
                            )}
                        </div>

                        <div className={styles.btnContainer}>
                            <Button onClickHandler={() => submitHandler}>
                                Update
                            </Button>
                            {loadingUpdate && <LoadingSpinner />}
                        </div>
                    </form>
                </div>
            </div>
        </DynamicDefaultLayout>
    );
};

export default ProductEditPage;
