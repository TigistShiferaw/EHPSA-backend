import { Request, Response } from 'express';
import { User, IUserInterface } from '../../resources/user/user.model';
import { encrypt } from '../../helpers/encryptPassword';
import _ from 'lodash';
import cloudinary from "../../config/cloudinary";

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
        const id = req.params.id;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json('User not found');
        }

        if (req.file) {
            const cloudinaryImage = await cloudinary.uploader.upload(req.file.path, {
                folder: '/EHPSA/Images',
                use_filename: true,
            });
            user.profilePicture = cloudinaryImage?.secure_url;
        }
        for (const key in req.body) {
          (user as any)[key] = req.body[key];
        }

        const updatedUser = await user.save();

        if (!updatedUser) {
            return res.status(404).json('User not found after update');
        }

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json('Something went wrong');
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