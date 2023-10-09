import otpGenerator from 'otp-generator'

export const generateOTP = (length: number) => {
  const OTP = otpGenerator.generate(length, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false
  })

  return OTP
}
