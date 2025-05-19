import { IsDateString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateReservationDTO {
  @IsInt()
  @IsNotEmpty()
  vehicleId: number;

 
}