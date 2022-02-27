import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import dbConnect from '../../../lib/dbConnect';
import Order from '../../../models/Order';
import { onError } from '../../../app/utils/error';
import { isAuth } from '../../../app/utils/auth';
import { UserType } from '../../../typings';

interface NextApiRequestUser extends NextApiRequest {
    user: UserType;
}

const handler = nc({ onError });

handler.use(isAuth);

handler.post(async (req: NextApiRequestUser, res: NextApiResponse) => {
    await dbConnect();

    try {
        const newOrder = new Order({
            ...req.body,
            user: req.user._id,
        });
        const order = await newOrder.save();
        res.status(201).send(order);
    } catch (error) {
        res.status(400).json({ success: false });
    }
});

export default handler;
