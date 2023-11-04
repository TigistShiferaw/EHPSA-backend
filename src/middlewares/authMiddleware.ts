import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface TokenPayload extends JwtPayload {
    userId: string;
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).send({ message: 'Unauthorized' });
        return;
    }


    const token = authHeader.split(' ')[1];

    try {

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as TokenPayload;

        req.user = { id: decodedToken._id };

        next();
    } catch (err) {

        console.error(err);
        res.status(401).send({ message: 'Unauthorized' });
    }
};