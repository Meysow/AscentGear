import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../app/utils/auth';

const handler = nc();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();

    try {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password),
            isAdmin: false,
        });
        const user = await newUser.save();

        const token = signToken(user);
        res.status(200).json({
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
