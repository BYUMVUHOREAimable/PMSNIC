import { Router } from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import vehicleRouter from "./vehicle.routes";
import parkingRouter from "./parking.routes";
import reservationRouter from "./reservation.routes";

const router = Router()

router.use("/auth", authRouter
    /*
        #swagger.tags = ['Auth']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
)
router.use("/user", userRouter
    /*
        #swagger.tags = ['Users']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
)
router.use("/vehicle", vehicleRouter
    /*
        #swagger.tags = ['vehicles']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
)
router.use("/parking", parkingRouter
    /*
        #swagger.tags = ['parkings']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
)
router.use("/reservation", reservationRouter
    /*
        #swagger.tags = ['reservation']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
)
export default router