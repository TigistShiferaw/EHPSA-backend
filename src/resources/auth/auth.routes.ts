import express from 'express'
import {  signUp, verifyEmail } from './signup'
import { respond } from '../../utils/respond';
import { signin } from './signin';
import { validateRequest } from '../../middlewares/validateRequest';
import { resetPassword } from './resetPassword';
import { forgotPassword } from './forgotPassword';
import { verifyToken } from '../../middlewares/verifyToken';
import { changePassword } from './changePassword';


const authRouter = express.Router()

console.log('authRouter');
authRouter.post('/signup', signUp, respond);
authRouter.post('/signin', validateRequest, signin, respond);
authRouter.post('/verify', verifyEmail, respond)
authRouter.post(
    '/forgotPassword',
  
    validateRequest,
    forgotPassword,
    respond
  )
  authRouter.post(
    '/resetPassword',
  
    validateRequest,
    resetPassword,
    respond
  )

  authRouter.put('/changePassword', verifyToken, changePassword, respond)

export default authRouter