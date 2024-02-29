import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { ProductType } from "../../../../typings";
import { ActionType, Store } from "../../../utils/Store";
import Button from "../../elements/Button";
import styles from "./CartPage.module.scss";

import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
const DynamicDefaultLayout = dynamic(
  () => import("../../layouts/DefaultLayout"),
  { ssr: false }
);

const CartPage = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    darkMode,
    cart: { cartItems },
  } = state;

  const handleQuantity = async (item: ProductType, quantity: number) => {
    const { data } = await axios.get(`/api/products/${item._id}`);

    if (data.data.countInStock < quantity) {
      // window.alert('Sorry, Product is out of stock');
      toast.error(`Sorry, Product is out of stock`, {
        theme: "colored",
      });
      return;
    }

    dispatch({
      type: ActionType.CART_ADD_ITEM,
      payload: { ...item, quantity },
    });
  };

  const removeItemHandler = (item: ProductType) => {
    dispatch({
      type: ActionType.CART_REMOVE_ITEM,
      payload: item,
    });
  };

  const checkOutHandler = () => {
    router.push("/shipping");
  };

  const isDarkMode = darkMode ? styles.darkMode : "";

  return (
    <DynamicDefaultLayout title="Shopping Cart">
      <>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className={styles.container}>
            Cart is Empty.{" "}
            <Link href="/">
              <a className={styles.blue}>Go Shopping</a>
            </Link>
          </div>
        ) : (
          <div className={styles.container}>
            <div className={styles.rows}>
              <div className={styles.left}>
                <div className={styles.Image}>Image</div>
                <div className={styles.Name}>Name</div>
                <div className={styles.Quantity}>Quantity</div>
                <div className={styles.Price}>Price</div>
                <div className={styles.Action}>Action</div>
              </div>

              <hr className={styles.hrTop} />

              {cartItems.map((item: ProductType) => (
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

                    <div className={styles.Name}>
                      <Link href={`/product/${item.slug}`}>
                        <a>
                          <p className={isDarkMode}>{item.name}</p>
                        </a>
                      </Link>
                    </div>

                    <div className={styles.Quantity}>
                      <select
                        name="quantity"
                        id="quantity"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantity(item, parseInt(e.target.value))
                        }
                      >
                        {[...Array(item.countInStock).keys()].map(
                          (x: number) => (
                            <option value={x + 1} key={x + 1}>
                              {x + 1}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div className={styles.Price}>
                      <p>${item.price}</p>
                    </div>
                    <div className={styles.Action}>
                      <Button
                        onClickHandler={() => removeItemHandler(item)}
                        color={"tertiary"}
                        fullWidth={false}
                      >
                        X
                      </Button>
                    </div>
                  </div>
                  <hr className={styles.hrBottom} />
                </div>
              ))}
            </div>
            <div className={styles.right}>
              <div className={`${styles.card} ${isDarkMode}`}>
                <p>
                  Subtotal (
                  {cartItems.reduce(
                    (a: number, c: ProductType) => a + c.quantity,
                    0
                  )}{" "}
                  items):
                </p>
                <p>
                  $
                  {cartItems.reduce(
                    (a: number, c: ProductType) => a + c.quantity * c.price,
                    0
                  )}
                </p>
                <Button
                  fullWidth
                  color={"default"}
                  onClickHandler={checkOutHandler}
                >
                  CHECK OUT
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    </DynamicDefaultLayout>
  );
};

export default CartPage;
