import { Request, Response } from 'express';
import prisma from '../prisma/prisma-client';
import ServerResponse from '../utils/ServerResponse';
import { AuthRequest } from '../types';
import { sendSlotApprovalEmail } from '../utils/emailService'; 



const createReservation = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // Assuming user is authenticated
    const { vehicleId } = req.body;

    // Validate vehicleId
    if (!vehicleId || typeof vehicleId !== 'number') {
      return ServerResponse.error(res, 'Invalid vehicle ID', { status: 400 });
    }

    // Verify vehicle belongs to user
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: vehicleId, userId },
    });

    if (!vehicle) {
      return ServerResponse.error(res, 'Vehicle not found or does not belong to user', { status: 404 });
    }

    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        userId: userId,
        vehicleId,
        status: 'PENDING',
        
          // Default status
      },
    });

    return ServerResponse.success(res, 'Slot request created successfully', { reservation });
  } catch (error) {
    console.error('Error creating slot request:', error);
    return ServerResponse.error(res, 'Error creating slot request', { error });
  }
};

const getReservations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    // Check for both 'searchkey' and 'searchKey' to handle case mismatch
    const searchKey = ((req.query.searchkey || req.query.searchKey) as string)?.trim() || '';

    console.log('Received searchKey:', searchKey); // Debug log

    const skip = (page - 1) * limit;

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    // Create base where condition
    const whereCondition: any = user?.role === "ADMIN" ? {} : { userId };

    // Add search conditions if searchKey exists and is non-empty
    if (searchKey) {
      whereCondition.OR = [
        { vehicle: { plate: { contains: searchKey, mode: 'insensitive' } } },
        { parkingSlot: { slotCode: { contains: searchKey, mode: 'insensitive' } } },
      ];
    }

    console.log('whereCondition:', JSON.stringify(whereCondition, null, 2)); // Debug log

    const [reservations, total] = await Promise.all([
      prisma.reservation.findMany({
        where: whereCondition,
        skip,
        take: limit,
        include: {
          vehicle: true,
          parkingSlot: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.reservation.count({
        where: whereCondition,
      }),
    ]);

    return ServerResponse.success(res, 'Reservations fetched', {
      reservations,
      meta: {
        page,
        limit,
        total,
        searchKey: searchKey || null,
      },
    });
  } catch (error) {
    console.error('Error fetching reservations:', error); // Log error for debugging
    return ServerResponse.error(res, 'Error fetching reservations', { error });
  }
};


 const updateReservation = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { reservationId } = req.params;
    const { vehicleId } = req.body;

    // Validate inputs
    if (!reservationId || !vehicleId || typeof vehicleId !== "number") {
      return ServerResponse.error(res, "Invalid reservation ID or vehicle ID", { status: 400 });
    }

    // Check if reservation exists and is pending
    const reservation = await prisma.reservation.findFirst({
      where: { id: parseInt(reservationId), userId, status: "PENDING" },
    });

    if (!reservation) {
      return ServerResponse.error(res, "Reservation not found, not pending, or does not belong to user", {
        status: 404,
      });
    }

    // Verify vehicle belongs to user
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: vehicleId, userId },
    });

    if (!vehicle) {
      return ServerResponse.error(res, "Vehicle not found or does not belong to user", { status: 404 });
    }

    // Update reservation
    const updatedReservation = await prisma.reservation.update({
      where: { id: parseInt(reservationId) },
      data: { vehicleId },
      include: { vehicle: true, parkingSlot: true },
    });

    return ServerResponse.success(res, "Reservation updated successfully", { reservation: updatedReservation });
  } catch (error) {
    console.error("Error updating reservation:", error);
    return ServerResponse.error(res, "Error updating reservation", { error });
  }
};

 const deleteReservation = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { reservationId } = req.params;

    // Validate input
    if (!reservationId) {
      return ServerResponse.error(res, "Invalid reservation ID", { status: 400 });
    }

    // Check if reservation exists and is pending
    const reservation = await prisma.reservation.findFirst({
      where: { id: parseInt(reservationId), userId, status: "PENDING" },
    });

    if (!reservation) {
      return ServerResponse.error(res, "Reservation not found, not pending, or does not belong to user", {
        status: 404,
      });
    }

    // Delete reservation
    await prisma.reservation.delete({
      where: { id: parseInt(reservationId) },
    });

    return ServerResponse.success(res, "Reservation cancelled successfully", {});
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return ServerResponse.error(res, "Error deleting reservation", { error });
  }
};




const approveReservation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Fetch reservation with related vehicle, user, and parking slot
    const reservation = await prisma.reservation.findUnique({
      where: { id: Number(id) },
      include: {
        vehicle: true,
        user: true,
        parkingSlot: true,
      },
    });

    if (!reservation) {
      return ServerResponse.error(res, 'Reservation not found', { status: 404 });
    }

    if (reservation.status !== 'PENDING') {
      return ServerResponse.error(res, 'Reservation is not pending', { status: 400 });
    }

    let parkingSlotId = reservation.parkingSlotId;
    let slotCode = reservation.parkingSlot?.slotCode;

    // Assign a compatible slot if not already assigned
    if (!parkingSlotId) {
      const compatibleSlot = await prisma.parkingSlot.findFirst({
        where: {
          status: 'available',
          // vehicleType: reservation.vehicle.type || undefined,
          // size: reservation.vehicle.size || undefined,
        },
      });

      if (!compatibleSlot) {
        return ServerResponse.error(res, 'No compatible parking slot available', { status: 400 });
      }

      parkingSlotId = compatibleSlot.id;
      slotCode = compatibleSlot.slotCode;

      // Update parking slot status to unavailable
      await prisma.parkingSlot.update({
        where: { id: compatibleSlot.id },
        data: { status: 'unavailable' },
      });
    }

    // Update reservation to APPROVED
    const updated = await prisma.reservation.update({
      where: { id: Number(id) },
      data: {
        status: 'APPROVED',
        parkingSlotId,
        updatedAt: new Date(),
      },
      include: {
        vehicle: true,
        user: true,
        parkingSlot: true,
      },
    });

    // Send approval email, but don't fail if email sending fails
    try {
      await sendSlotApprovalEmail({
        to: updated.user.email,
        slotCode: updated.parkingSlot!.slotCode,
        plate: updated.vehicle.plate,
        timestamp: updated.updatedAt.toISOString(),
      });
    } catch (emailError) {
      console.error(`Failed to send approval email to ${updated.user.email}:`, emailError);
      // Continue with success response despite email failure
    }

    return ServerResponse.success(res, 'Reservation approved', updated);
  } catch (error) {
    console.error('Error approving reservation:', error);
    return ServerResponse.error(res, 'Error approving reservation', { error });
  }
};

const rejectReservation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await prisma.reservation.update({
      where: { id: Number(id) },
      data: {
        status: 'REJECTED',
        updatedAt: new Date(),
      },
    });

    
    return ServerResponse.success(res, 'Reservation rejected', updated);
  } catch (error) {
    console.error('Error rejecting reservation:', error);
    return ServerResponse.error(res, 'Error rejecting reservation', { error });
  }
};

const reservationController = {
  createReservation,
  getReservations,
  deleteReservation,
  updateReservation,
  approveReservation,
  rejectReservation,
};

export default reservationController;