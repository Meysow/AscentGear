import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
const DynamicUserEditPage = dynamic(
    () => import('../../../app/components/templates/UserEditPage'),
    { ssr: false }
);

interface Props {
    params: {
        id: string;
    };
}

const UserEdit = ({ params }: Props) => {
    return <DynamicUserEditPage params={params} />;
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    return {
        props: { params },
    };
};

export default UserEdit;
