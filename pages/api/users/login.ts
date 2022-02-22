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
        const user = await User.findOne({
            email: req.body.email,
        }); /* find the user with the email */
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            const token = signToken(user);
            res.status(200).json({
                token,
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            });
        } else {
            res.status(401).json({
                message: 'Invalid User or Password',
            });
        }
    } catch (error) {
        res.status(400).json({ success: false });
    }
});

export default handler;
