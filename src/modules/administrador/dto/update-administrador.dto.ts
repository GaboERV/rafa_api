import { IsOptional, IsString, IsEmail, IsPhoneNumber, MinLength } from 'class-validator';

export class UpdateAdministradorDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(8)
  contrasena?: string;

  @IsOptional()
  @IsPhoneNumber()
  telefono?: string;
}
