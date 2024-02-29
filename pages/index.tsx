import dynamic from "next/dynamic";
import HomePage from "../app/components/templates/HomePage";
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
}

const Home = ({ featuredProducts, topRatedProducts }: Props) => {
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

    // Combined query if possible, else keep as is but with added error handling
    const [featuredProducts, topRatedProducts] = await Promise.all([
      Product.find({ isFeatured: true }, "-reviews")
        .lean()
        .limit(3)
        .then((results) => results.map(convertDocToObj)),
      Product.find({}, "-reviews")
        .sort({ rating: -1 })
        .lean()
        .limit(6)
        .then((results) => results.map(convertDocToObj)),
    ]);

    return {
      props: {
        featuredProducts,
        topRatedProducts,
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
