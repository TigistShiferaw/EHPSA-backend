import { NextFunction, Request, Response } from 'express'
import { encrypt } from '../../helpers/encryptPassword'
import { generateOTP } from '../../helpers/otp'
import { OTP } from '../../resources/OTP/otp.model'
import { User } from '../../resources/user/user.model'
import _ from 'lodash'

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.email) {
    return next()
  }
  const { email, otp, newPassword } = req.body
  if (!email) {
    return next()
  }
  const user = await User.findOne({ email })

  if (!user) {
    res.locals.json = {
      statusCode: 404,
      message: 'User not found!'
    }
    return next()
  }
  const originalOTP = await OTP.findOne({ email })
  if (!otp || !originalOTP || !user.isVerified || !newPassword) {
    res.locals.json = {
      statusCode: 400,
      message: 'Cannot Change Password'
    }
    return next()
  }

  if (otp !== originalOTP.otpCode) {
    res.locals.json = {
      statusCode: 403,
      message: 'You are forbidden to do the changes'
    }
    return next()
  }
  user.password = await encrypt(newPassword)
  await user.save()
  originalOTP.otpCode = generateOTP(12)
  await originalOTP.save()
  res.locals.json = {
    statusCode: 200,
    message: 'Password Successfully changed!'
  }
  return next()
}

