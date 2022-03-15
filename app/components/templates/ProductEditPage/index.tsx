import styles from './ProductEditPage.module.scss';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useContext, useReducer, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Store } from '../../../utils/Store';
import { getError } from '../../../utils/error';
import Button from '../../elements/Button';
import LoadingSpinner from '../../elements/LoadingSpinner';
import Image from 'next/image';
import SwitchButton from '../../elements/SwitchButton';

const DynamicDefaultLayout = dynamic(
    () => import('../../layouts/DefaultLayout'),
    { ssr: false }
);

interface IState {
    loading: boolean;
    error: string;
    loadingUpdate: boolean;
    loadingUpload: boolean;
}

const initialState: IState = {
    loading: true,
    error: '',
    loadingUpdate: false,
    loadingUpload: false,
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
        case 'UPLOAD_REQUEST':
            return { ...state, loadingUpload: true, errorUpload: '' };
        case 'UPLOAD_SUCCESS':
            return {
                ...state,
                loadingUpload: false,
                errorUpload: '',
            };
        case 'UPLOAD_FAIL':
            return {
                ...state,
                loadingUpload: false,
                errorUpload: action.payload,
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
    const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
        useReducer(reducer, initialState);
    const { register, handleSubmit, formState, setValue, watch } = useForm();

    const router = useRouter();
    const { userInfo } = state;

    const [securedURL, setSecuredURL] = useState<string>();
    const [imageId, setImageId] = useState<string>();
    const [isFeatured, setIsFeatured] = useState<boolean>(false);

    const [securedURLFeatured, setSecuredURLFeatured] = useState<string>('');
    const [imageIdFeatured, setImageIdFeatured] = useState<string>('');

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
                    setSecuredURL(data.image);
                    setIsFeatured(data.isFeatured);
                    data.featuredImage &&
                        setSecuredURLFeatured(data.featuredImage);
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

    const uploadHandler = async (e: any, imageField = 'file') => {
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('file', file);
        bodyFormData.append('productId', productId);
        bodyFormData.append('imageField', imageField);

        try {
            dispatch({ type: 'UPLOAD_REQUEST' });
            const { data } = await axios.post(
                '/api/admin/upload',
                bodyFormData,
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );
            dispatch({ type: 'UPLOAD_SUCCESS' });
            console.log(data, 'data');
            console.log(data.secure_url, 'data.secure_url');

            if (imageField === 'file') {
                setSecuredURL(data.secure_url);
                setImageId(data.public_id);
            }

            if (imageField === 'featuredFile') {
                setSecuredURLFeatured(data.secure_url);
                setImageIdFeatured(data.public_id);
            }

            toast.success('Image Uploaded Successfully', {
                theme: 'colored',
            });
        } catch (err) {
            dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
            toast.error('Error in Image Upload', {
                theme: 'colored',
            });
        }
    };

    const submitHandler = async ({
        name,
        slug,
        price,
        category,
        brand,
        countInStock,
        description,
    }: any) => {
        toast.dismiss();
        try {
            dispatch({ type: 'UPDATE_REQUEST' });
            if (isFeatured) {
                if (!securedURLFeatured || securedURLFeatured === '') {
                    toast.error('Please upload a Featured Image', {
                        theme: 'colored',
                    });
                    return;
                }

                await axios.put(
                    `/api/admin/products/${productId}`,
                    {
                        name,
                        slug,
                        price,
                        category,
                        image: securedURL,
                        cloudinary_id_image: imageId,
                        isFeatured: isFeatured,
                        featuredImage: securedURLFeatured,
                        cloudinary_id_featuredImage: imageIdFeatured,
                        brand,
                        countInStock,
                        description,
                    },
                    {
                        headers: {
                            authorization: `Bearer ${userInfo.token}`,
                        },
                    }
                );
            } else {
                await axios.put(
                    `/api/admin/products/${productId}`,
                    {
                        name,
                        slug,
                        price,
                        category,
                        image: securedURL,
                        cloudinary_id_image: imageId,
                        isFeatured,
                        brand,
                        countInStock,
                        description,
                    },
                    {
                        headers: {
                            authorization: `Bearer ${userInfo.token}`,
                        },
                    }
                );
            }

            toast.success('Product updated successfully', {
                theme: 'colored',
            });
            dispatch({ type: 'UPDATE_SUCCESS' });
        } catch (err) {
            dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
            console.log(err, 'error in submitHandler');
            toast.error(getError(err), {
                theme: 'colored',
            });
        }
    };

    const switchHandler = () => {
        setIsFeatured((prev: boolean) => !prev);
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

                        <Button
                            color='tertiary'
                            onClickHandler={() => router.push('/admin/users')}
                        >
                            Users
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
                                    type='file'
                                    id='image'
                                    name='file'
                                    className={styles.ipt}
                                    onChange={uploadHandler}
                                />
                            </label>

                            {securedURL && (
                                <>
                                    <p className={styles.imageTitle}>
                                        Preview :
                                    </p>
                                    <div className={styles.imagePreview}>
                                        <Image
                                            src={securedURL}
                                            alt='choosen'
                                            height={200}
                                            width={200}
                                            layout='responsive'
                                            objectFit='cover'
                                            priority
                                        />
                                    </div>
                                    {loadingUpload && (
                                        <div>
                                            <LoadingSpinner dark />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div>
                            <label className={styles.lbl}>
                                Is Featured
                                <div className={styles.switchFlex}>
                                    <span>NO</span>
                                    <SwitchButton
                                        onChangeHandler={switchHandler}
                                        checked={isFeatured}
                                    />
                                    <span>YES</span>
                                </div>
                            </label>
                        </div>

                        {isFeatured && (
                            <div>
                                <label className={styles.lbl}>
                                    Featured Image
                                    <input
                                        type='file'
                                        id='featuredImage'
                                        name='featuredFile'
                                        className={styles.ipt}
                                        onChange={(e) =>
                                            uploadHandler(e, 'featuredFile')
                                        }
                                    />
                                </label>
                                {securedURLFeatured && (
                                    <>
                                        <p className={styles.imageTitle}>
                                            Preview :
                                        </p>
                                        <div className={styles.imagePreview}>
                                            <Image
                                                src={securedURLFeatured}
                                                alt='Featured'
                                                height={200}
                                                width={200}
                                                layout='responsive'
                                                objectFit='cover'
                                                priority
                                            />
                                        </div>
                                        {loadingUpload && (
                                            <div>
                                                <LoadingSpinner dark />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

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
                            <Button
                                onClickHandler={() =>
                                    console.log('Submit in Edit Page !')
                                }
                                submit
                            >
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
