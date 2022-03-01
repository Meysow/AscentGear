import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import Order from '../../../../models/Order';
import dbConnect from '../../../../lib/dbConnect';
import { onError } from '../../../../app/utils/error';
import { isAuth } from '../../../../app/utils/auth';

const handler = nc({
    onError,
});
handler.use(isAuth);

handler.put(async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();
    const order = await Order.findById(req.query.id);
    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const deliveredOrder = await order.save();

        res.send({ message: 'order delivered', order: deliveredOrder });
    } else {
        res.status(404).send({ message: 'order not found' });
    }
});

export default handler;
