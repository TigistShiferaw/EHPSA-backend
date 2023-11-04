import { Request, Response } from 'express';
import { User, IUserInterface } from '../../resources/user/user.model';
import { encrypt } from '../../helpers/encryptPassword';
import _ from 'lodash';
import { Types } from 'mongoose';

interface RequestWithUser extends Request {
  user: IUserInterface;
}

export class UserController {
  public async createUser(req: Request, res: Response): Promise<Response<any>> {
    try {
      const { email, password, firstName, lastName, role } = req.body;
      const emailExists = await User.findOne({ email });

      if (req.user.role !== 'superadmin' && role && role === 'admin' ) {
        return res.status(403).send('Forbidden');
      }

      if (emailExists) {
        return res.status(400).json({
          statusCode: 400,
          message: 'Email already exists',
        });
      }
      const hashedPassword = await encrypt(password);
      const newUser = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
      });
      return res.status(201).json({
        statusCode: 201,
        data: _.pick(newUser, ['email', 'firstName', 'lastName', 'role']),
      });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(400).json({ message: error });
    }
  }

  public async readUser(req: RequestWithUser, res: Response): Promise<Response<any>> {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          statusCode: 404,
          message: 'User not found',
        });
      }
      if (req.user.role === 'admin' && user.role === 'admin' && req.user._id.toString() !== user._id.toString()) {
        return res.status(403).send('Forbidden');
      }
      return res.status(200).json({
        statusCode: 200,
        data: _.pick(user, ['email', 'firstName', 'lastName', 'role']),
      });
    } catch (error) {
      console.error('Error reading user:', error);
      return res.status(400).json({ message: error });
    }
  }

  public async updateUser(req: RequestWithUser, res: Response): Promise<Response<any>> {
    try {
      const { id } = req.params;
      const { email, password, firstName, lastName, role } = req.body;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          statusCode: 404,
          message: 'User not found',
        });
      }
      if (req.user.role !== 'superadmin' && role  && req.user._id.toString() !== user._id.toString()) {
        return res.status(403).send('Forbidden');
      }
      if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return res.status(400).json({
            statusCode: 400,
            message: 'Email already exists',
          });
        }
        user.email = email;
      }
      if (password) {
        const hashedPassword = await encrypt(password);
        user.password = hashedPassword;
      }
      if (firstName) {
        user.firstName = firstName;
      }
      if (lastName) {
        user.lastName = lastName;
      }
      if (role) {
        user.role = role;
      }
      await user.save();
      return res.status(200).json({
        statusCode: 200,
        data: _.pick(user, ['email', 'firstName', 'lastName', 'role']),
      });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(400).json({ message: error });
    }
  }
  public async deleteUser(req: RequestWithUser, res: Response): Promise<Response<any>> {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          statusCode: 404,
          message: 'User not found',
        });
      }
      if (req.user.role === 'admin' && user.role === 'admin' && req.user._id.toString() !== user._id.toString()) {
        return res.status(403).send('Forbidden');
      }
      if (req.user.role === 'admin' && user.role === 'superadmin') {
        return res.status(403).send('Forbidden');
      }
      if (req.user.role === 'user' && req.user._id.toString() !== user._id.toString()) {
        return res.status(403).send('Forbidden');
      }
      await (user as IUserInterface);
      return res.status(200).json({
        statusCode: 200,
        message: 'User deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(400).json({ message: error });
    }
  }
}