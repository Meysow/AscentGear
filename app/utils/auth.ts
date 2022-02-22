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
