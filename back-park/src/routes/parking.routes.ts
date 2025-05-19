import { Router } from 'express';
import parkingController from '../controllers/parking.controller';
import { checkAdmin, checkLoggedIn } from '../middlewares/auth.middleware';
import { validationMiddleware } from '../middlewares/validator.middleware';
import { CreateParkingSlotDTO } from '../dtos/parking.dto';

const parkingRouter = Router();

parkingRouter.post('/create', [checkAdmin, validationMiddleware(CreateParkingSlotDTO)], parkingController.createParkingSlot);
parkingRouter.get('/all', checkLoggedIn, parkingController.getAllParkingSlots);
parkingRouter.put("/:slotId", checkAdmin, parkingController.updateParkingSlot);
parkingRouter.delete("/:slotId", checkAdmin, parkingController.deleteParkingSlot);

export default parkingRouter;