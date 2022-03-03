import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { isAuth, isAdmin } from '../../../../app/utils/auth';
import User from '../../../../models/User';
import dbConnect from '../../../../lib/dbConnect';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();
    const users = await User.find({});
    res.send(users);
});

export default handler;
