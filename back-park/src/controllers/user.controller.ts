import { hashSync , compareSync, compare } from "bcrypt";
import { config } from "dotenv";
import { Request, Response } from "express";
import prisma from "../prisma/prisma-client";
import ServerResponse from "../utils/ServerResponse";

config()

const createUser = async (req: Request, res: Response) => {
    try {
        const { email, firstName,lastName, phoneNumber, password,role } = req.body
        const hashedPassword = hashSync(password, 10)
        const user = await prisma.user.create({
            data: {
                email,
                firstName,
                lastName,
                phoneNumber,
                role: role || "USER",
                password: hashedPassword
            }
        })
        return ServerResponse.created(res, "User created successfully", { user })
        
    } catch (error: any) {
        if (error.code === 'P2002') {
            const key = error.meta.target[0]
            return ServerResponse.error(res, `${key.charAt(0).toUpperCase() + key.slice(1)} (${req.body[key]}) already exists`, 400);
        }
        return ServerResponse.error(res, "Error occured", { error })
    }
}


const updateUser = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, phoneNumber, oldPassword, newPassword } = req.body;
        console.log(req)
        const userId = (req as any).user.id;
       
        console.log("DATA: ",req.body)

        const dataToUpdate: any = {};

        if (firstName) dataToUpdate.firstName = firstName;
        if (lastName) dataToUpdate.lastName = lastName;
        if (phoneNumber) dataToUpdate.phoneNumber = phoneNumber;

        if (newPassword) {
            const existingUser = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!existingUser) {
                return ServerResponse.error(res, "User not found", 404);
            }

            const isMatch = compareSync(oldPassword, existingUser.password);
            if (!isMatch) {
                return ServerResponse.error(res, "Old password is incorrect", 400);
            }

            dataToUpdate.password = hashSync(newPassword, 10);
            console.log(dataToUpdate)
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: dataToUpdate
        });

        return ServerResponse.success(res, "User updated successfully", { user: updatedUser });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return ServerResponse.error(res, "User not found", 404);
        }
        return ServerResponse.error(res, "Error updating user", { error });
    }
};



const userController = {
    createUser,
    updateUser
}

export default userController;