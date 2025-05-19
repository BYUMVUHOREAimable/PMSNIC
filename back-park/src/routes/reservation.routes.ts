import { Router } from 'express';
import reservationController from '../controllers/reservation.controller';
import { checkAdmin, checkLoggedIn } from '../middlewares/auth.middleware';
import { validationMiddleware } from '../middlewares/validator.middleware';
import { CreateReservationDTO } from '../dtos/reservation.dto';

const reservationRouter = Router();

reservationRouter.post('/create', [checkLoggedIn, validationMiddleware(CreateReservationDTO)], reservationController.createReservation);
reservationRouter.get("/all", checkLoggedIn,  reservationController.getReservations);
reservationRouter.put("/:reservationId", checkLoggedIn ,  reservationController.updateReservation);
reservationRouter.delete("/:reservationId",checkLoggedIn, reservationController.deleteReservation);
reservationRouter.put('/:id/approve', checkAdmin, reservationController.approveReservation);
reservationRouter.put('/:id/reject', checkAdmin, reservationController.rejectReservation);

export default reservationRouter;