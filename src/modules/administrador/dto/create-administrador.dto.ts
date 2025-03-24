import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  MinLength,
  MaxLength, // Importa MaxLength
} from 'class-validator';

export class CreateAdministradorDto {
  @ApiProperty({ description: 'Nombre del administrador' }) // Descripción para Swagger
  @IsNotEmpty({ message: 'El nombre es requerido' }) // Mensaje de error personalizado
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre: string;

  @ApiProperty({ description: 'Correo electrónico del administrador' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' }) // Opciones de IsEmail (opcional)
  email: string;

  @ApiProperty({ description: 'Contraseña del administrador' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(100, { message: 'La contraseña no debe tener más de 100 caracteres' }) // Límite máximo (opcional)
  contrasena: string;

  @ApiProperty({ description: 'Número de teléfono del administrador' })
  @IsNotEmpty({ message: 'El número de teléfono es requerido' })
  @IsPhoneNumber('MX',{ message: 'El número de teléfono no es válido' }) // Especifica el país (opcional)
  telefono: string;
}