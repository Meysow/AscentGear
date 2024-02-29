import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useContext } from "react";
import { Rating } from "react-simple-star-rating";
import { toast } from "react-toastify";
import { ProductArray, ProductType } from "../../../../typings";
import { ActionType, Store } from "../../../utils/Store";
import Button from "../../elements/Button";
import styles from "./Cards.module.scss";

function Cards({ products }: ProductArray) {
  const { dispatch, state } = useContext(Store);
  const { darkMode } = state;
  const router = useRouter();

  const addToCartHandler = useCallback(
    async (product: ProductType) => {
      const existItem = state.cart.cartItems.find(
        (x: ProductType) => x._id === product._id
      );
      const quantity = existItem ? existItem.quantity + 1 : 1;

      const { data } = await axios.get(`/api/products/${product._id}`);
      if (data.data.countInStock < quantity) {
        toast.error(`Sorry, Product is out of stock`, {
          theme: "colored",
        });
        return;
      }

      dispatch({
        type: ActionType.CART_ADD_ITEM,
        payload: { ...product, quantity },
      });
      router.push("/cart");
    },
    [dispatch, state.cart.cartItems, router]
  );

  const isDarkMode = darkMode ? styles.darkMode : "";

  return (
    <div className={styles.container}>
      {products.map((product) => (
        <div className={`${styles.card} ${isDarkMode}`} key={product._id}>
          <Link href={`/product/${product.slug}`} passHref>
            <div className={styles["image-container"]}>
              <Image
                src={product.image}
                alt={product.name}
                height={200}
                width={200}
                layout="responsive"
                objectFit="cover"
              />
            </div>
          </Link>

          <div className={styles["card__content"]}>
            <div className={styles.flex}>
              <p className={styles["card__content--title"]}>{product.name}</p>
              <Rating
                initialValue={product.rating}
                readonly
                allowFraction
                size={23}
              />
            </div>
            <div className={styles["card__content--body"]}>
              <p>${product.price}</p>
              <Button onClickHandler={() => addToCartHandler(product)}>
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default React.memo(Cards);
