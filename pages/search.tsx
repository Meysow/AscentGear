import dbConnect, { convertDocToObj } from '../lib/dbConnect';
import Product from '../models/Product';
import SearchPage from '../app/components/templates/SearchPage';

const PAGE_SIZE = 3;

const Search = (props: any) => {
    return <SearchPage serverProps={props} />;
};

export const getServerSideProps = async ({ query }: any) => {
    await dbConnect();
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const brand = query.brand || '';
    const price = query.price || 0;
    const rating = query.rating || 0;
    const sort = query.sort || '';
    const searchQuery = query.query || '';

    const queryFilter =
        searchQuery && searchQuery !== 'all'
            ? {
                  name: {
                      $regex: searchQuery,
                      $options: 'i',
                  },
              }
            : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const brandFilter = brand && brand !== 'all' ? { brand } : {};
    const ratingFilter =
        rating && rating !== 'all'
            ? {
                  rating: {
                      $gte: Number(rating),
                  },
              }
            : {};
    // 10-50
    const priceFilter =
        price && price !== 'all'
            ? {
                  price: {
                      $gte: Number(price.split('-')[0]),
                      $lte: Number(price.split('-')[1]),
                  },
              }
            : {};

    const order =
        sort === 'featured'
            ? { featured: -1 }
            : sort === 'Price: Low to High'
            ? { price: 1 }
            : sort === 'Price: High to Low'
            ? { price: -1 }
            : sort === 'Customer Reviews'
            ? { rating: -1 }
            : sort === 'Newest Arrivals'
            ? { createdAt: -1 }
            : { _id: -1 };

    const categories = await Product.find().distinct('category');
    const brands = await Product.find().distinct('brand');
    const productDocs = await Product.find(
        {
            ...queryFilter,
            ...categoryFilter,
            ...priceFilter,
            ...brandFilter,
            ...ratingFilter,
        },
        '-reviews'
    )
        .sort(order)
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .lean();

    const countProducts = await Product.countDocuments({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...brandFilter,
        ...ratingFilter,
    });

    const products = productDocs.map(convertDocToObj);

    return {
        props: {
            products,
            countProducts,
            page,
            pages: Math.ceil(countProducts / pageSize),
            categories,
            brands,
        },
    };
};

export default Search;
