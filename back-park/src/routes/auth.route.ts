import { Router } from "express";
import authController from "../controllers/auth.controller";
import { LoginDTO } from "../dtos/auth.dto";
import { validationMiddleware } from "../middlewares/validator.middleware";

const authRouter = Router()

authRouter.post("/login", [validationMiddleware(LoginDTO)], authController.login)

export default authRouter