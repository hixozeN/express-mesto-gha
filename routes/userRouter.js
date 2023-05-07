const userRouter = require('express').Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/', getAllUsers);
userRouter.get('/me', getUser);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
