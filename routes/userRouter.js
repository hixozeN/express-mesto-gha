const userRouter = require("express").Router();
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
} = require("../controllers/users");

userRouter.post("/", createUser);
userRouter.get("/", getAllUsers);
userRouter.get("/:userId", getUser);
userRouter.patch("/me", updateUser);
userRouter.patch("/me/avatar", updateAvatar);

module.exports = userRouter;
