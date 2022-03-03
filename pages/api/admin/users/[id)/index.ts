import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { isAuth, isAdmin } from '../../../../../app/utils/auth';
import User from '../../../../../models/User';
import dbConnect from '../../../../../lib/dbConnect';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();
    const user = await User.findById(req.query.id);
    res.send(user);
});

handler.put(async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();
    const user = await User.findById(req.query.id);
    if (user) {
        user.name = req.body.name;
        user.slug = req.body.slug;
        user.price = req.body.price;
        user.category = req.body.category;
        user.image = req.body.image;
        user.brand = req.body.brand;
        user.countInStock = req.body.countInStock;
        user.description = req.body.description;
        await user.save();
        res.send({ message: 'User Updated Successfully' });
    } else {
        res.status(404).send({ message: 'User Not Found' });
    }
});

handler.delete(async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();
    const user = await User.findById(req.query.id);
    if (user) {
        await user.remove();
        res.send({ message: 'User Deleted' });
    } else {
        res.status(404).send({ message: 'User Not Found' });
    }
});

export default handler;
