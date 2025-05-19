import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateParkingSlotDTO {
  @IsNotEmpty()
  @IsString()
  slotCode: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['small', 'medium', 'large'])
  size: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['car', 'motorcycle', 'truck'])
  vehicleType: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsString()
  status?: string; // Optional, defaults to 'available'
}
