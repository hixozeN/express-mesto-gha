const userRouter = require('express').Router();
const {
  getAllUsers,
  getUser,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/', getAllUsers);
userRouter.get('/me', getCurrentUser);
userRouter.get('/:userId', getUser);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
