import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  IsOptional,
  MinLength,
} from "class-validator";

export class CreateUserDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  lastName: string;


  @IsString()
  @MinLength(2)
  @MaxLength(50)
  phoneNumber: string;


  @IsString()
  @MinLength(2)
  @MaxLength(50)
  role: string;



  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/, {
    message:
      "Password must have at least 6 characters, one symbol, one number, and one uppercase letter.",
  })
  readonly password: string;
}


export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  oldPassword?: string;

  @IsOptional()
  @IsString()
  newPassword?: string;
}
