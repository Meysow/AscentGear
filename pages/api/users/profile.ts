import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { isAuth, signToken } from '../../../app/utils/auth';

const handler = nc();
handler.use(isAuth);

handler.put(async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();

    try {
        const user = await User.findById(req.user._id);
        user.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password
            ? bcrypt.hashSync(req.body.password) // if new passWord, save new password
            : user.password; // Else, use old passWord

        await user.save();

        const token = signToken(user);
        res.send({
            token,
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } catch (error) {
        res.status(400).json({ success: false });
    }
});

export default handler;
