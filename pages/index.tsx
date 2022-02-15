import type { NextPage } from 'next';
import Layout from '../app/components/layouts/DefaultLayout';
import HomePage from '../app/components/templates/HomePage';

const Home: NextPage = () => {
    return (
        <Layout>
            <HomePage />
        </Layout>
    );
};

export default Home;
