import { compareSync } from "bcrypt"
import { Request, Response } from "express"
import jwt from 'jsonwebtoken'
import prisma from "../prisma/prisma-client"
import ServerResponse from "../utils/ServerResponse"

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const user = await prisma.user.findUnique({
            where: { email }
        })
        if (!user) return ServerResponse.error(res, "Invalid email or password")
        const isMatch = compareSync(password, user.password)
        if (!isMatch) return ServerResponse.error(res, "Invalid email or password")
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY as string, { expiresIn: '3d' })
        return ServerResponse.success(res, "Login successful", { user, token })
    } catch (error) {
        return ServerResponse.error(res, "Error occured", { error })
    }
}


const authController = {
    login
}

export default authController