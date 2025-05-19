import { Request, Response } from 'express';
import prisma from '../prisma/prisma-client';
import ServerResponse from '../utils/ServerResponse';

const createVehicle = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { plate, model, type, size, color } = req.body;

    const vehicle = await prisma.vehicle.create({
      data: {
        plate,
        model,
        type,
        size,
        color,
        userId,
      },
    });

    return ServerResponse.success(res, 'Vehicle registered', vehicle);
  } catch (error) {
    return ServerResponse.error(res, 'Error registering vehicle', { error });
  }
};


const getMyVehicles = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    // Check for both 'searchkey' and 'searchKey' to handle case mismatch
    const searchKey = ((req.query.searchkey || req.query.searchKey) as string)?.trim() || '';

    console.log('Received searchKey:', searchKey); // Debug log

    const skip = (page - 1) * limit;

    // Create base where condition
    const whereCondition: any = { userId };

    // Add search conditions if searchKey exists and is non-empty
    if (searchKey) {
      whereCondition.OR = [
        { plate: { contains: searchKey, mode: 'insensitive' } },
        { model: { contains: searchKey, mode: 'insensitive' } },
       
      ];
    }

    console.log('whereCondition:', JSON.stringify(whereCondition, null, 2)); // Debug log

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where: whereCondition,
        skip,
        take: limit,
      }),
      prisma.vehicle.count({ 
        where: whereCondition,
      }),
    ]);

    return ServerResponse.success(res, 'Vehicles fetched', {
      vehicles,
      meta: {
        page,
        limit,
        total,
        searchKey: searchKey || null,
      },
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error); // Log error for debugging
    return ServerResponse.error(res, 'Error fetching vehicles', { error: error });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const vehicle = await prisma.vehicle.findUnique({ where: { id: +id } });
    if (!vehicle || vehicle.userId !== userId)
      return ServerResponse.unauthorized(res, 'Not allowed to delete this vehicle');
    await prisma.vehicle.delete({ where: { id: +id } });
    return ServerResponse.success(res, 'Vehicle deleted');
  } catch (error) {
    return ServerResponse.error(res, 'Error deleting vehicle', { error });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { vehicleId } = req.params;
    const { plate, model, color, size, type } = req.body;

    // Validate input
    if (!vehicleId || !plate) {
      return ServerResponse.error(res, "Vehicle ID and plate are required", { status: 400 });
    }

    // Check if vehicle exists and belongs to user
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: parseInt(vehicleId), userId },
    });

    if (!vehicle) {
      return ServerResponse.error(res, "Vehicle not found or does not belong to user", { status: 404 });
    }

    // Check if new plate is unique (if changed)
    if (plate !== vehicle.plate) {
      const existingVehicle = await prisma.vehicle.findUnique({ where: { plate } });
      if (existingVehicle) {
        return ServerResponse.error(res, "Plate number already exists", { status: 400 });
      }
    }

    // Update vehicle
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: parseInt(vehicleId) },
      data: {
        plate,
        model: model || null,
        color: color || null,
        size: size || null,
        type: type || null,
      },
    });

    return ServerResponse.success(res, "Vehicle updated successfully", { vehicle: updatedVehicle });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return ServerResponse.error(res, "Error updating vehicle", { error });
  }
};



const vehicleController = {
  createVehicle,
  getMyVehicles,
  deleteVehicle,
  updateVehicle
};

export default vehicleController;