import { Request, Response, NextFunction } from 'express'
import { User, IUserInterface } from '../user/user.model'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import JWT, { Secret } from 'jsonwebtoken'

dotenv.config()

export const signin = async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    if (!req.body.email) {
        return next()
    }
    try {
        const user = await User.findOne({
        email: req.body.email
        })
        console.log('user', user);
        if (!user) {
        res.locals.json = {
            statusCode: 401,
            message: 'Incorrect email or password'
        }
        return next()
        }

        const isMatched = await bcrypt.compare(req.body.password.toString(), user.password.toString())
        if (!isMatched) {
        res.locals.json = {
            statusCode: 401,
            message: 'Incorrect email or password'
        }
        return next()
        }

        if (!user.isVerified) {
            res.locals.json = {
              statusCode: 401,
              message: 'User is not verified'
            }
            return next()
          }
      



        const token = JWT.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET as Secret)
        console.log('token', token);
        res.locals.json = {
        statusCode: 200,
        data: {
            token: token
        }
        }
        return next()
    } catch (error) {
        console.error('Error signing in:', error)
        res.locals.json = {
        statusCode: 500,
        message: 'Sign in failed'
        }
        return next()
    }
}
