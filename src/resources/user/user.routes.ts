import { RequestHandler, Router } from 'express';
import { UserController } from './user.controller';
import { addUserToRequest } from '../../middlewares/userRequest';
import { authenticate } from '../../middlewares/authMiddleware';

const userRouter = Router();
const userController = new UserController();

userRouter.post('/', authenticate, addUserToRequest, userController.createUser );
userRouter.get('/:id', authenticate, addUserToRequest, userController.readUser );
userRouter.put('/:id', authenticate, addUserToRequest, userController.updateUser );
userRouter.delete('/:id', authenticate, addUserToRequest, userController.deleteUser );

export default userRouter;