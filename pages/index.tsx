import dynamic from "next/dynamic";
import { useContext, useEffect } from "react";
import HomePage from "../app/components/templates/HomePage";
import { ActionType, Store } from "../app/utils/Store";
import dbConnect, { convertDocToObj } from "../lib/dbConnect";
import Product from "../models/Product";
import { ProductType } from "../typings";
const DynamicDefaultLayout = dynamic(
  () => import("../app/components/layouts/DefaultLayout"),
  {
    ssr: false,
  }
);

interface Props {
  topRatedProducts: ProductType[];
  featuredProducts: ProductType[];
  categories: string[];
}

const Home = ({ featuredProducts, topRatedProducts, categories }: Props) => {
  const { dispatch } = useContext(Store);
  useEffect(() => {
    dispatch({ type: ActionType.SET_CATEGORIES, payload: categories });
  }, [categories, dispatch]);

  return (
    <DynamicDefaultLayout title="Search">
      <HomePage
        featuredProducts={featuredProducts}
        topRatedProducts={topRatedProducts}
      />
    </DynamicDefaultLayout>
  );
};

export async function getStaticProps() {
  try {
    await dbConnect();

    const [featuredProducts, topRatedProducts, categories] = await Promise.all([
      Product.find({ isFeatured: true }, "-reviews")
        .lean()
        .limit(3)
        .then((results) => results.map(convertDocToObj)),
      Product.find({}, "-reviews")
        .sort({ rating: -1 })
        .lean()
        .limit(6)
        .then((results) => results.map(convertDocToObj)),
      Product.find().distinct("category"),
    ]);

    return {
      props: {
        featuredProducts,
        topRatedProducts,
        categories,
      },
      revalidate: 1800, // Adjust depending on your content update frequency
    };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return {
      notFound: true,
    };
  }
}

export default Home;
