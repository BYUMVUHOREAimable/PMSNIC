import { Request, RequestHandler } from "express";

export interface AuthRequest extends Request {
    user: {
        id: number;
    }
}




// export interface AuthMiddleware extends RequestHandler<> {
//     req: AuthRequest
// }

type AuthMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => void