import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
    @ApiProperty()
    email: string;
  
    @ApiProperty()
    contrasena: string;
  }
  