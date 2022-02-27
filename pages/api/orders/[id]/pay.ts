import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { isAuth } from '../../../../app/utils/auth';
import { onError } from '../../../../app/utils/error';
import dbConnect from '../../../../lib/dbConnect';
import Order from '../../../../models/Order';

const handler = nc({
    onError,
});

handler.use(isAuth);

handler.put(async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();

    try {
        const order = await Order.findById(req.query.id);
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                email_address: req.body.email_address,
            };
            const paidOrder = await order.save();
            res.send({ message: 'order paid', order: paidOrder });
        }
    } catch (error) {
        res.status(404).json({ message: 'order not found' });
    }
});

export default handler;
