import styles from './UserEditPage.module.scss';
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
        // case 'UPLOAD_REQUEST':
        //     return { ...state, loadingUpload: true, errorUpload: '' };
        // case 'UPLOAD_SUCCESS':
        //     return {
        //         ...state,
        //         loadingUpload: false,
        //         errorUpload: '',
        //     };
        // case 'UPLOAD_FAIL':
        //     return {
        //         ...state,
        //         loadingUpload: false,
        //         errorUpload: action.payload,
        //     };
        default:
            return state;
    }
}

interface Props {
    params: {
        id: string;
    };
}

const UserEditPage = ({ params }: Props) => {
    const userId = params.id;
    const { state } = useContext(Store);
    const [{ loading, error, loadingUpdate }, dispatch] = useReducer(
        reducer,
        initialState
    );
    const { register, handleSubmit, formState, setValue } = useForm();
    const router = useRouter();
    const { userInfo } = state;

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (!userInfo) {
            router.push('/login');
            return;
        } else {
            const fetchData = async () => {
                try {
                    dispatch({ type: 'FETCH_REQUEST' });
                    const { data } = await axios.get(
                        `/api/admin/users/${userId}`,
                        {
                            headers: {
                                authorization: `Bearer ${userInfo.token}`,
                            },
                        }
                    );
                    setIsAdmin(data.isAdmin);
                    dispatch({ type: 'FETCH_SUCCESS' });
                    setValue('name', data.name);
                } catch (err) {
                    dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
                }
            };
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submitHandler = async ({ name }: any) => {
        toast.dismiss();
        try {
            dispatch({ type: 'UPDATE_REQUEST' });
            await axios.put(
                `/api/admin/users/${userId}`,
                {
                    name,
                    isAdmin,
                },
                { headers: { authorization: `Bearer ${userInfo.token}` } }
            );
            dispatch({ type: 'UPDATE_SUCCESS' });
            toast.success('User updated successfully', {
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
        <DynamicDefaultLayout title={`Edit User ${userId}`}>
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
                            color='tertiary'
                            onClickHandler={() =>
                                router.push('/admin/products')
                            }
                        >
                            Products
                        </Button>

                        <Button
                            selected
                            color='tertiary'
                            onClickHandler={() => router.push('/admin/users')}
                        >
                            Users
                        </Button>
                    </div>
                </div>
                <div className={styles.containerRight}>
                    <h1>Edit User {userId}</h1>

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
                                Is Admin
                                <input
                                    type='checkbox'
                                    id='isAdmin'
                                    checked={isAdmin}
                                    onClick={(e: any) =>
                                        setIsAdmin(e.target.checked)
                                    }
                                    className={styles.ipt}
                                    {...register('isAdmin')}
                                />
                            </label>
                            {formState?.errors?.isAdmin && (
                                <p className={styles.error}>
                                    {formState?.errors?.isAdmin.message}
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

export default UserEditPage;
