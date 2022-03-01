import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { isAuth, isAdmin } from '../../../../app/utils/auth';
import { onError } from '../../../../app/utils/error';
import Product from '../../../../models/Product';
import dbConnect from '../../../../lib/dbConnect';

const handler = nc({
    onError,
});
handler.use(isAuth, isAdmin);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();
    const orders = await Product.find({});

    res.send(orders);
});

export default handler;
