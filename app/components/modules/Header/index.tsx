import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ActionType, Store } from "../../../utils/Store";
import { getError } from "../../../utils/error";
import Button from "../../elements/Button";
import HamburgerButton from "../../elements/HamburgerButton";
import LoadingSpinner from "../../elements/LoadingSpinner";
import SwitchButton from "../../elements/SwitchButton";
import styles from "./Header.module.scss";

export default function Header() {
  const [active, setActive] = useState(false);
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, userInfo } = state;
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
        setLoading(false);
      } catch (err) {
        toast.error(getError(err), { theme: "colored" });
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const toggleDarkMode = () => {
    dispatch({
      type: darkMode ? ActionType.DARK_MODE_OFF : ActionType.DARK_MODE_ON,
    });

    const newDarkMode = !darkMode;
    Cookies.set("darkMode", newDarkMode ? "ON" : "OFF");
  };

  const handleNavigation = (redirect: string) => {
    setActive(false);
    if (redirect) {
      router.push(redirect);
    }
  };

  const logout = () => {
    dispatch({ type: ActionType.USER_LOGOUT });
    Cookies.remove("userInfo");
    Cookies.remove("cartItems");
    router.push("/");
  };

  const isActive = active ? styles.active : styles.inactive;

  return (
    <header className={styles.headerWrapper}>
      <nav className={styles.header}>
        <HamburgerButton>
          {categories && (
            <>
              <ul className={styles.categories}>
                {loading && <LoadingSpinner />}
                {categories.map((category) => (
                  <li key={category}>
                    <Link href={`/search?category=${category}`}>
                      <a>{category}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </HamburgerButton>
        <Link href="/">
          <a>
            <span className={styles.logo}>AscentGear</span>
          </a>
        </Link>
        <div className={styles.right}>
          <SwitchButton onChangeHandler={toggleDarkMode} checked={darkMode} />
          <Link href="/cart">
            <a className={styles.badgeRoot}>
              {cart.cartItems.length > 0 && (
                <div className={styles.badge}>{cart.cartItems.length}</div>
              )}
              Cart
            </a>
          </Link>
          {userInfo ? (
            <div className={styles.dropdown}>
              <Button onClickHandler={() => setActive(!active)}>
                {userInfo.name}
              </Button>
              <div className={`${styles.dropdownContent} ${isActive}`}>
                <Button onClickHandler={() => handleNavigation("/profile")}>
                  Profile
                </Button>
                <Button
                  onClickHandler={() => handleNavigation("/order-history")}
                >
                  Order History
                </Button>
                {userInfo.isAdmin && (
                  <Button
                    onClickHandler={() => handleNavigation("/admin/dashboard")}
                  >
                    Admin Dashboard
                  </Button>
                )}
                <Button onClickHandler={logout}>Logout</Button>
              </div>
            </div>
          ) : (
            <Link href="/login">
              <a>Login</a>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
