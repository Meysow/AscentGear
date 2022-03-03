import styles from './AdminUsersPage.module.scss';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useContext, useReducer } from 'react';
import { Store } from '../../../utils/Store';
import { getError } from '../../../utils/error';
import Button from '../../elements/Button';
import LoadingSpinner from '../../elements/LoadingSpinner';
import { OrderTypesTwo, UserType } from '../../../../typings';
import { toast } from 'react-toastify';

const DynamicDefaultLayout = dynamic(
    () => import('../../layouts/DefaultLayout')
);

interface IState {
    loading: boolean;
    users: UserType[];
    error: string;
    successDelete: boolean;
    loadingDelete: boolean;
}

const initialState: IState = {
    loading: true,
    users: [],
    error: '',
    successDelete: false,
    loadingDelete: false,
};

function reducer(state: IState, action: any) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false,
                users: action.payload,
                error: '',
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };

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

const AdminUsersPage = () => {
    const { state } = useContext(Store);
    const router = useRouter();
    const { userInfo } = state;

    const [{ loading, error, users, successDelete, loadingDelete }, dispatch] =
        useReducer(reducer, initialState);

    useEffect(() => {
        if (!userInfo) {
            router.push('/login');
        }
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/admin/users`, {
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

    const deleteHandler = async (userId: string) => {
        if (!window.confirm('Are you sure?')) {
            return;
        }
        try {
            dispatch({ type: 'DELETE_REQUEST' });
            await axios.delete(`/api/admin/users/${userId}`, {
                headers: { authorization: `Bearer ${userInfo.token}` },
            });
            dispatch({ type: 'DELETE_SUCCESS' });
            toast.success('User deleted successfully', {
                theme: 'colored',
            });
        } catch (err) {
            dispatch({ type: 'DELETE_FAIL' });
            toast.error(getError(err), { theme: 'colored' });
        }
    };

    return (
        <DynamicDefaultLayout title='Admin Users'>
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
                                onClickHandler={() =>
                                    router.push('/admin/users')
                                }
                            >
                                Users
                            </Button>
                        </div>
                    </div>
                    <div className={styles.containerRight}>
                        <h1>Users</h1>
                        <div className={styles.row}>
                            <div className={styles.Id}>ID</div>
                            <div className={styles.Name}>NAME</div>
                            <div className={styles.Email}>EMAIL</div>
                            <div className={styles.IsAdmin}>ISADMIN</div>
                            <div className={styles.Actions}>ACTIONS</div>
                        </div>

                        {users.map((user: UserType) => (
                            <div className={styles.row} key={user._id}>
                                <p className={styles.Id}>
                                    {user._id.substring(20, 24)}
                                </p>
                                <p className={styles.Name}>{user.name}</p>
                                <p className={styles.Email}>{user.email}</p>
                                <p className={styles.IsAdmin}>
                                    {user.isAdmin ? `YES` : 'NO'}
                                </p>
                                <div className={styles.Action}>
                                    <Button
                                        color='tertiary'
                                        onClickHandler={() =>
                                            router.push(`/user/${user._id}`)
                                        }
                                    >
                                        Edit
                                    </Button>

                                    <Button
                                        color='tertiary'
                                        onClickHandler={() =>
                                            deleteHandler(user._id)
                                        }
                                    >
                                        Edit
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

export default AdminUsersPage;
