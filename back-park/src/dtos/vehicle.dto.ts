import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVehicleDTO {
  @IsNotEmpty()
  @IsString()
  plate: string

  @IsNotEmpty()
  @IsString()
  type: string

  @IsNotEmpty()
  @IsString()
  size: string

  @IsNotEmpty()
  @IsString()
  model: string

  @IsNotEmpty()
  @IsString()
  color: string
}