import { Request, Response } from 'express';
import prisma from '../prisma/prisma-client';
import ServerResponse from '../utils/ServerResponse';

const createParkingSlot = async (req: Request, res: Response) => {
  try {
    const { slotCode, size, vehicleType, location, status } = req.body;

    
    const exists = await prisma.parkingSlot.findUnique({ where: { slotCode } });
    if (exists) return ServerResponse.error(res, 'Slot code already exists');

  
    const slot = await prisma.parkingSlot.create({
      data: {
        slotCode,
        size,
        vehicleType,
        location,
        status: status || 'available', // default to 'available' if not provided
      },
    });

    return ServerResponse.success(res, 'Slot created successfully', slot);
  } catch (error) {
    return ServerResponse.error(res, 'Something went wrong', error);
  }
};


const getAllParkingSlots = async (req: Request, res: Response) => {
   try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const searchKey = ((req.query.searchkey || req.query.searchKey) as string)?.trim() || '';

    console.log('Received searchKey for parking slots:', searchKey); // Debug log

    const skip = (page - 1) * limit;

    // Create base where condition (no userId filter)
    const whereCondition: any = {};

    // Add search conditions if searchKey exists and is non-empty
    if (searchKey) {
      whereCondition.OR = [
        { slotCode: { contains: searchKey, mode: 'insensitive' } },
        { vehicleType: { contains: searchKey, mode: 'insensitive' } },
        { size: { contains: searchKey, mode: 'insensitive' } },
      ];
    }

    console.log('whereCondition:', JSON.stringify(whereCondition, null, 2)); // Debug log

    const [parkingSlots, total] = await Promise.all([
      prisma.parkingSlot.findMany({
        where: whereCondition,
        skip,
        take: limit,
      }),
      prisma.parkingSlot.count({
        where: whereCondition,
      }),
    ]);

    return ServerResponse.success(res, 'Parking slots fetched', {
      parkingSlots,
      meta: {
        page,
        limit,
        total,
        searchKey: searchKey || null,
      },
    });
  } catch (error) {
    console.error('Error fetching parking slots:', error);
    return ServerResponse.error(res, 'Error fetching parking slots', { error });
  }
};

 const updateParkingSlot = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { slotId } = req.params;
    const { slotCode, size, vehicleType, location, status } = req.body;

    // Validate input
    if (!slotId || !slotCode) {
      return ServerResponse.error(res, "Slot ID and slot code are required", { status: 400 });
    }

    // Check if slot exists
    const slot = await prisma.parkingSlot.findUnique({
      where: { id: parseInt(slotId) },
    });

    if (!slot) {
      return ServerResponse.error(res, "Parking slot not found", { status: 404 });
    }

    // Check if new slotCode is unique (if changed)
    if (slotCode !== slot.slotCode) {
      const existingSlot = await prisma.parkingSlot.findUnique({ where: { slotCode } });
      if (existingSlot) {
        return ServerResponse.error(res, "Slot code already exists", { status: 400 });
      }
    }

    // Update parking slot
    const updatedSlot = await prisma.parkingSlot.update({
      where: { id: parseInt(slotId) },
      data: {
        slotCode,
        size: size || null,
        vehicleType: vehicleType || null,
        location: location || null,
        status: status || "available",
      },
    });

    return ServerResponse.success(res, "Parking slot updated successfully", { parkingSlot: updatedSlot });
  } catch (error) {
    console.error("Error updating parking slot:", error);
    return ServerResponse.error(res, "Error updating parking slot", { error });
  }
};


const deleteParkingSlot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.parkingSlot.delete({ where: { id: Number(id) } });
    return ServerResponse.success(res, 'Slot deleted');
  } catch (error) {
    return ServerResponse.error(res, 'Error deleting slot', error);
  }
};

const parkingController = {
  createParkingSlot,
  getAllParkingSlots,
  deleteParkingSlot,
  updateParkingSlot
};

export default parkingController;