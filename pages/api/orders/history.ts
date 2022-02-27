import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import dbConnect from '../../../lib/dbConnect';
import Order from '../../../models/Order';
import { onError } from '../../../app/utils/error';
import { isAuth } from '../../../app/utils/auth';

const handler = nc({ onError });

handler.use(isAuth);

handler.get(async (req: any, res: NextApiResponse) => {
    await dbConnect();

    try {
        const orders = await Order.find({ user: req.user._id });
        res.send(orders);
    } catch (error) {
        res.status(400).json({ success: false });
    }
});

export default handler;
