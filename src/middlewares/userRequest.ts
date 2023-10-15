import { Request, Response, NextFunction } from 'express';
import { User } from '../resources/user/user.model';

export const addUserToRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await User.findById(req.user?.id);

        if (!user) {
            console.log('Unauthorized');
            res.status(401).send({ message: 'Unauthorized' });
            return;
        }

        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal server error' });
    }
};