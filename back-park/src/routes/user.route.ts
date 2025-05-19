import { Router } from "express";
import userController from "../controllers/user.controller";
import { CreateUserDTO , UpdateUserDTO } from "../dtos/user.dto";
import { validationMiddleware } from "../middlewares/validator.middleware";
import { checkLoggedIn } from "../middlewares/auth.middleware";

const userRouter = Router()

userRouter.post("/create", [validationMiddleware(CreateUserDTO)], userController.createUser)
userRouter.post("/update", [checkLoggedIn,validationMiddleware(UpdateUserDTO)], userController.updateUser)

export default userRouter