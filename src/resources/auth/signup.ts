import { Request, Response } from 'express';
import * as Joi from 'joi';
import { User } from '../../resources/user/user.model';
import { encrypt } from '../../helpers/encryptPassword';
import _ from 'lodash';
import { generateOTP } from '../../helpers/otp';
import { OTP } from '../OTP/otp.model';
import { sendMail } from '../../helpers/mail';

export const signUp = async (
  req: Request,
  res: Response,
) => {
  console.log('req.body', req.body);
  try {
    const { email, phoneNumber, password, firstName, lastName, membershipType, volunteeringInterest, university, studentIdURL,  dateOfBirth, profilePicture, resume, relevantDocuments } = req.body;
    console.log('email', email);
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Email already exists',
      });
    }
    const user = {
      email,
      password,
      firstName,
      lastName,
      membershipType,
      volunteeringInterest,
      university,
      studentIdURL,
      phoneNumber,
      dateOfBirth,
      profilePicture,
      resume,
      relevantDocuments,
    };
    const result = validateInput(user);
    if (result.error) {
      return res.status(400).json({
        statusCode: 400,
        message: result.error.details[0].message,
      });
    }
    const newUser = await createUser(email, password, firstName, lastName, membershipType, volunteeringInterest, university, studentIdURL,  phoneNumber, dateOfBirth, profilePicture, resume, relevantDocuments);
    return res.status(201).json({
      statusCode: 201,
      data: newUser,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(400).json({ message: error });
  }
};


function validateInput(user: any) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(255).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    volunteeringInterest: Joi.boolean().required(),
    membershipType: Joi.when('volunteeringInterest', {
      is: true,
      then: Joi.string().valid('student', 'associate', 'professional').allow(null),
      otherwise: Joi.string().valid('student', 'associate', 'professional').required(),
    }),
    phoneNumber: Joi.string().required(),
    dateOfBirth: Joi.date().required(),
    profilePicture: Joi.string().required(),
    resume: Joi.when('volunteeringInterest', {
      is: true,
      then: Joi.string().required(),
      otherwise: Joi.string().allow(null),
    }),
    relevantDocuments: Joi.array().items(Joi.string()).allow(null),
    studentIdURL: Joi.when('membershipType', {
      is: 'student',
      then: Joi.string().required(),
      otherwise: Joi.string().allow(null),
    }),
    university: Joi.when('membershipType', {
      is: 'student',
      then: Joi.string().required(),
      otherwise: Joi.string().allow(null),
    }),
  });
  return schema.validate(user);
}

const createUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  membershipType: string,
  volunteeringInterest: boolean,
  university: string | null,
  studentIdURL: string | null,
  phoneNumber: string | null,
  dateOfBirth: Date | null,
  profilePicture: string | null,
  resume: string | null,
  relevantDocuments: string[] | null,
) => {
  try {
    const hashedPassword = await encrypt(password);

    const OTPGenerated = generateOTP(6)
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      membershipType,
      volunteeringInterest,
      university,
      studentIdURL,
      phoneNumber,
      dateOfBirth,
      profilePicture,
      resume,
      relevantDocuments,
    });
    
    const otp = await OTP.create({
      email: email,
      otpCode: OTPGenerated
    })

    
    const info = await sendMail({
      to: email,
      OTP: OTPGenerated,
      type: 'OTP'
    })
    console.log("After otp when creating a user sending mail and everyting....")

    return _.pick(newUser, ['email', 'firstName', 'lastName']);
  } catch (error) {
    console.log('Error creating user:', error);
    throw new Error('Error creating user');
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const checkUser = await User.findOne({ email: email });

  if (!checkUser) {
    return res.status(400).json({
      statusCode: 400,
      message: 'Wrong verification code'
    });
  }

  if (checkUser.isVerified) {
    return res.status(400).json({
      statusCode: 400,
      message: 'User is already verified'
    });
  }

  const user = await validateUser(email, otp);

  if (!user) {
    return res.status(400).json({
      statusCode: 400,
      message: 'Wrong verification code'
    });
  }

  return res.status(200).json({
    statusCode: 200,
    message: 'Account successfully verified'
  });
};

const validateUser = async (email: String, otp: String) => {
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return false
    }
    const userOtp = await OTP.findOne({ email })
    if (userOtp?.otpCode !== otp) {
      return false
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, {
      $set: { isVerified: true }
    })
    return updatedUser
  } catch (error) {
    return false
  }
}