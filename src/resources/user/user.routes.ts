import { RequestHandler, Router } from 'express';
import { UserController } from './user.controller';
import { addUserToRequest } from '../../middlewares/userRequest';
import { authenticate } from '../../middlewares/authMiddleware';
import { filterImage } from "../../middlewares/multer";


const userRouter = Router();
const userController = new UserController();

userRouter.post('/', authenticate, addUserToRequest, userController.createUser );
userRouter.get('/:id', authenticate, addUserToRequest, userController.readUser );
userRouter.put('/:id', authenticate, addUserToRequest,filterImage.single('profilePicture'), userController.updateUser );
userRouter.delete('/:id', authenticate, addUserToRequest, userController.deleteUser );

export default userRouter;