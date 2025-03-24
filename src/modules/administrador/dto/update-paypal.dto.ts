// src/administrador/dto/update-paypal-dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdatePaypalDto {
  @ApiProperty({ description: 'Correo electrónico de PayPal', example: 'admin@example.com' })
  @IsNotEmpty({ message: 'El correo electrónico de PayPal no puede estar vacío.' })
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido.' })
  paypalEmail: string;
}