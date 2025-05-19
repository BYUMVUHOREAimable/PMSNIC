import { Router } from 'express';
import vehicleController from '../controllers/vehicle.controller';
import { CreateVehicleDTO } from '../dtos/vehicle.dto';
import { validationMiddleware } from '../middlewares/validator.middleware';
import { checkLoggedIn } from '../middlewares/auth.middleware';

const vehicleRouter = Router();

vehicleRouter.post(
  '/create',
  [checkLoggedIn, validationMiddleware(CreateVehicleDTO)],
  vehicleController.createVehicle
);

vehicleRouter.get('/all', checkLoggedIn, vehicleController.getMyVehicles);
vehicleRouter.delete('/:id', checkLoggedIn, vehicleController.deleteVehicle);
vehicleRouter.put("/:vehicleId", checkLoggedIn,vehicleController.updateVehicle);


export default vehicleRouter;
