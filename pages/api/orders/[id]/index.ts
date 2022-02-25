import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { isAuth } from '../../../../app/utils/auth';
import dbConnect from '../../../../lib/dbConnect';
import Order from '../../../../models/Order';

const handler = nc();

handler.use(isAuth);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();

    try {
        const order = await Order.findById(req.query.id);
        res.send(order);
    } catch (error) {
        res.status(400).json({ success: false });
    }
});

export default handler;
