import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Store } from "../../../utils/Store";
import Footer from "../../modules/Footer";
import styles from "./DefaultLayout.module.scss";

const DynamicHeader = dynamic(() => import("../../modules/Header"), {
  ssr: false,
});

const DefaultLayout = ({
  title,
  children,
}: {
  title?: string;
  children: JSX.Element;
}) => {
  const { state } = useContext(Store);
  const { darkMode } = state;

  const themeChecker = () => {
    if (Cookies.get("darkMode" || darkMode === true) === "ON") {
      return "dark-mode";
    } else return "light-mode";
  };

  return (
    <div className={styles[`${themeChecker()}`]}>
      <Head>
        <title>
          {title ? `${title} - AscentGear Next` : "AscentGear Next"}
        </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DynamicHeader />

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <main className={styles.main}>{children}</main>

      <Footer />
    </div>
  );
};

export default DefaultLayout;
