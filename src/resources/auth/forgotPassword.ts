import { NextFunction, Request, Response } from 'express'
import { sendMail } from '../../helpers/mail'
import { generateOTP } from '../../helpers/otp'
import { OTP } from '../../resources/OTP/otp.model'
import { User } from '../../resources/user/user.model'
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body
  if (!req.body.email) {
    return next()
  }
  const user = await User.find({ email: email })
  if (!user) {
    res.locals.json = {
      statusCode: 404,
      message: 'User Not found'
    }
    return next()
  }

  const OTPGenerated = generateOTP(6)
  const otp = await OTP.findOne({ email })
  if (otp) {
    otp.otpCode = OTPGenerated
    await otp.save()
  } else {
    await OTP.create({
      email,
      OTPGenerated
    })
  }
  try {
    const info = await sendMail({
      to: email,
      link: `http://localhost:3000/auth/reset-password/?email=${email}&otp=${OTPGenerated}`,
      type: 'link'
    })
    res.locals.json = {
      statusCode: 200,
      message: 'A link to changing password sent to your email'
    }
    return next()
  } catch (error) {
    res.locals.json = {
      statusCode: 500,
      message: 'Something went wrong'
    }
    return next()
  }
}

