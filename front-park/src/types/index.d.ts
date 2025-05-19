export interface TimestampAudit {
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUser extends TimestampAudit {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role: string;
}

export interface IVehicle extends TimestampAudit {
    id?: number | null;
    userId: number;
    plate: string;
    model: string | null;
    type: 'car' | 'motorcycle' | 'truck' | null;
    size: 'small' | 'medium' | 'large' | null;
    color?: string | null;
}

export interface ILoginData {
    email: string;
    password: string;
}

export interface IMeta {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number;
    next: number;
}

export type RegisterInputs = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: string;
};

export type UpdateInputs = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    oldPassword: string;
    newPassword: string;
};

export interface IParkingSlot {
    id: number;
    slotCode: string;
    size: 'small' | 'medium' | 'large' | null;
    vehicleType: 'car' | 'motorcycle' | 'truck' | null;
    location: string | null;
    status: 'available' | 'unavailable';
}

export interface IReservation {
    id: number;
    userId: number;
    vehicleId: number;
    parkingSlotId: number | null;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    updatedAt: string;
    vehicle: { plate: string; model: string };
    parkingSlot: { slotCode: string } | null;
}