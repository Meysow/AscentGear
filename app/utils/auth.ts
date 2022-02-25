import jwt from 'jsonwebtoken';
import { UserType } from '../../typings';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error(
        'Please define the JWT_SECRET environment variable inside .env.local'
    );
}

export const signToken = (user: UserType) => {
    return jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        },
        JWT_SECRET,
        {
            expiresIn: '30d',
        }
    );
};

export const isAuth = async (req: any, res: any, next: any) => {
    const { authorization } = req.headers;
    if (authorization) {
        // format : Bearer XXX, so we start at 7th character to remove 'Bearer'
        const token = authorization.slice(7, authorization.length);
        jwt.verify(token, JWT_SECRET, (err: any, decode: any) => {
            if (err) {
                res.status(401).send({ message: 'Token is not Valid' });
            } else {
                req.user = decode;
                next();
            }
        });
    } else {
        res.status(401).send({ message: 'Token is not Supplied' });
    }
};
