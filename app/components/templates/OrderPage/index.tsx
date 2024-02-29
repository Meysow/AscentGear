import {
  PayPalButtons,
  SCRIPT_LOADING_STATE,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useReducer } from "react";
import { toast } from "react-toastify";
import { ProductType } from "../../../../typings";
import { Store } from "../../../utils/Store";
import { getError } from "../../../utils/error";
import Button from "../../elements/Button";
import CheckoutWizard from "../../elements/CheckoutWizard";
import LoadingSpinner from "../../elements/LoadingSpinner";
import styles from "./OrderPage.module.scss";
const DynamicDefaultLayout = dynamic(
  () => import("../../layouts/DefaultLayout"),
  { ssr: false }
);

interface Props {
  orderId: string;
}

interface IState {
  loading: boolean;
  order: any;
  error: string;
  loadingPay: boolean;
  successPay: boolean;
  errorPay: string;
  loadingDeliver: boolean;
  successDeliver: boolean;
  errorDeliver: string;
}

const initialState: IState = {
  loading: true,
  order: {},
  error: "",
  loadingPay: true,
  successPay: false,
  errorPay: "",
  loadingDeliver: false,
  successDeliver: false,
  errorDeliver: "",
};

enum FetchActionType {
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_FAIL,
  PAY_REQUEST,
  PAY_SUCCESS,
  PAY_FAIL,
  PAY_RESET,
  DELIVER_REQUEST,
  DELIVER_SUCCESS,
  DELIVER_FAIL,
  DELIVER_RESET,
}
interface IAction {
  type: FetchActionType | string;
  payload?: any;
}

function reducer(state: IState, action: IAction): IState {
  switch (action.type) {
    case FetchActionType.FETCH_REQUEST:
      return { ...state, loading: true, error: "" };
    case FetchActionType.FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        order: action.payload,
        error: "",
      };
    case FetchActionType.FETCH_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FetchActionType.PAY_REQUEST:
      return { ...state, loadingPay: true };
    case FetchActionType.PAY_SUCCESS:
      return {
        ...state,
        loadingPay: false,
        successPay: true,
      };
    case FetchActionType.PAY_FAIL:
      return {
        ...state,
        loadingPay: false,
        errorPay: action.payload,
      };
    case FetchActionType.PAY_RESET:
      return {
        ...state,
        loadingPay: false,
        successPay: false,
        errorPay: "",
      };
    case FetchActionType.DELIVER_REQUEST:
      return { ...state, loadingDeliver: true };
    case FetchActionType.DELIVER_SUCCESS:
      return { ...state, loadingDeliver: false, successDeliver: true };
    case FetchActionType.DELIVER_FAIL:
      return {
        ...state,
        loadingDeliver: false,
        errorDeliver: action.payload,
      };
    case FetchActionType.DELIVER_RESET:
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
        errorDeliver: "",
      };
    default:
      return state;
  }
}

const OrderPage = ({ orderId }: Props) => {
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo, darkMode } = state;

  const [
    { loading, error, order, successPay, loadingDeliver, successDeliver },
    dispatch,
  ] = useReducer(reducer, initialState);

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: FetchActionType.FETCH_REQUEST });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({
          type: FetchActionType.FETCH_SUCCESS,
          payload: data,
        });
      } catch (err) {
        dispatch({
          type: FetchActionType.FETCH_FAIL,
          payload: getError(err),
        });
      }
    };
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: FetchActionType.PAY_RESET });
      }
      if (successDeliver) {
        dispatch({ type: "DELIVER_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get("/api/keys/paypal", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD",
          },
        });
        paypalDispatch({
          type: "setLoadingStatus",
          value: SCRIPT_LOADING_STATE.PENDING,
        });
      };
      loadPaypalScript();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, successPay, successDeliver]);

  function createOrder(data: any, actions: any) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID: any) => orderID);
  }

  function onApprove(data: any, actions: any) {
    return actions.order.capture().then(async function (details: any) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("Order is paid", {
          theme: "colored",
        });
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: getError(err) });
        toast.error(getError(err), {
          theme: "colored",
        });
      }
    });
  }

  function onError(err: any) {
    toast.error(getError(err), {
      theme: "colored",
    });
  }

  async function deliverOrderHandler() {
    try {
      dispatch({ type: "DELIVER_REQUEST" });
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "DELIVER_SUCCESS", payload: data });
      toast.success("Order is delivered", {
        theme: "colored",
      });
    } catch (err) {
      dispatch({ type: "DELIVER_FAIL", payload: getError(err) });
      toast.error(getError(err), {
        theme: "colored",
      });
    }
  }

  return (
    <DynamicDefaultLayout title={`Order ${orderId}`}>
      <>
        {!isPaid && (
          <div className={styles.wrapper}>
            <CheckoutWizard activeStep={4} />
          </div>
        )}
        <h1>
          Order{" "}
          <span
            className={`${styles.orderId} ${darkMode ? styles.darkMode : ""}`}
          >
            {orderId}
          </span>
        </h1>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <div className={styles.container}>
            <div className={styles.leftSection}>
              <div className={styles.rows}>
                <h3>Shipping Adress</h3>
                <div className={styles.flexContainer}>
                  <div className={styles.flexContainerLeft}>
                    <p>Name: </p>
                    <p>Address: </p>
                    <p>City: </p>
                    <p>Postal Code: </p>
                    <p>Country: </p>
                  </div>
                  <div className={styles.flexContainerRight}>
                    <p>{shippingAddress.name}</p>
                    <p>{shippingAddress.address}</p>
                    <p>{shippingAddress.city}</p>
                    <p>{shippingAddress.postalCode}</p>
                    <p>{shippingAddress.country}</p>
                  </div>
                </div>
                <div className={styles.status}>
                  <p>
                    Status:{" "}
                    {isDelivered
                      ? `Delivered at ${deliveredAt}`
                      : "Not Delivered"}
                  </p>
                </div>
              </div>
              <div className={styles.rows}>
                <h3>Payment Method</h3>
                <p>{paymentMethod}</p>
                <div className={styles.status}>
                  <p>Status: {isPaid ? `Paid at ${paidAt}` : "Not paid"}</p>
                </div>
              </div>
              <div className={styles.rows}>
                <h3>Order Items</h3>
                <div className={styles.left}>
                  <div className={styles.Image}>Image</div>
                  <div className={styles.Name}>Name</div>
                  <div className={styles.Quantity}>Quantity</div>
                  <div className={styles.Price}>Price</div>
                </div>

                <hr className={styles.hrTop} />

                {orderItems.map((item: ProductType) => (
                  <div key={item._id}>
                    <div className={styles.left}>
                      <div className={styles.Image}>
                        <Link href={`/product/${item.slug}`}>
                          <a>
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            />
                          </a>
                        </Link>
                      </div>

                      <div
                        className={`${styles.Name} ${
                          darkMode ? styles.darkMode : ""
                        }`}
                      >
                        <Link href={`/product/${item.slug}`}>
                          <a>
                            <p>{item.name}</p>
                          </a>
                        </Link>
                      </div>

                      <div className={styles.Quantity}>
                        <p>{item.quantity}</p>
                      </div>
                      <div className={styles.Price}>
                        <p>${item.price}</p>
                      </div>
                    </div>
                    <hr className={styles.hrBottom} />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.right}>
              <div className={styles.card}>
                <h3>Order Summary</h3>
                <div className={styles.flexContainer}>
                  <div className={styles.flexContainerLeft}>
                    <p>Items: </p>
                    <p>Tax: </p>
                    <p>Shipping: </p>
                    <p>
                      <strong>Total: </strong>
                    </p>
                  </div>
                  <div className={styles.flexContainerRight}>
                    <p>${itemsPrice}</p>
                    <p>${taxPrice}</p>
                    <p>${shippingPrice}</p>
                    <p>
                      <strong>${totalPrice}</strong>
                    </p>
                  </div>
                </div>
                {!isPaid && (
                  <div>
                    {isPending ? (
                      <LoadingSpinner />
                    ) : (
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      ></PayPalButtons>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
          <div>
            {loadingDeliver && <LoadingSpinner />}
            <Button fullWidth onClickHandler={deliverOrderHandler}>
              Deliver Order
            </Button>
          </div>
        )}
      </>
    </DynamicDefaultLayout>
  );
};

export default OrderPage;
