// src/administrador/administrador.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  NotFoundException,
  UseGuards,
  Request,
  Patch, // Importa Patch
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdministradorService } from './administrador.service';
import { CreateAdministradorDto } from './dto/create-administrador.dto';
import { LoginUserDto } from './dto/login-user';
import { Verify2FACodeDto } from './dto/verify-2fa-code.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/jwt/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { UpdatePaypalDto } from './dto/update-paypal.dto';


@ApiTags('Administradores') // 🏷️ Agrupa los endpoints bajo la etiqueta "Administradores"
@Controller('admin')
export class AdministradorController {
  constructor(private readonly administradorService: AdministradorService) {}



  @Roles('administrador') // 🔑 Define que solo los administradores tienen acceso
  @Get('perfil')
  @ApiOperation({ summary: 'Obtener perfil del administrador autenticado' }) // 📝 Describe el propósito del endpoint
  @ApiResponse({ status: 200, description: 'Perfil del administrador', type: Object }) // ✅ Describe una respuesta exitosa
  @ApiUnauthorizedResponse({ description: 'No autorizado' }) // ❌ Describe una respuesta de no autorizado
  @ApiForbiddenResponse({ description: 'Acceso prohibido' }) // 🚫 Describe una respuesta de acceso prohibido
  getPerfil(@Request() req: any) {
    return req.user;
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión como administrador' })
  @ApiBody({ type: LoginUserDto, description: 'Credenciales de inicio de sesión' })
  @ApiResponse({ status: 200, description: 'Token de acceso', type: String }) // Cambia el tipo a String si retornas solo el token
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas' })
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.administradorService.login(loginUserDto);
  }

  @Post('register')
  async register(@Body() registerUserDto: CreateAdministradorDto) {
    return this.administradorService.registro(registerUserDto);
  }

  @Post('verify-2fa/:userId')
  @ApiOperation({ summary: 'Verificar código de autenticación de dos factores' })
  @ApiParam({ name: 'userId', type: Number, description: 'ID del administrador' })
  @ApiBody({ type: Verify2FACodeDto, description: 'Código 2FA' })
  @ApiResponse({ status: 200, description: 'Verificación exitosa', type: Object }) // Cambia el tipo si retornas un objeto con información
  @ApiResponse({ status: 400, description: 'Código inválido' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async verify2FACode(
    @Param('userId') userId: number,
    @Body() verify2FACodeDto: Verify2FACodeDto,
  ) {
    const { code } = verify2FACodeDto;
    return this.administradorService.verify2FACode(Number(userId), code);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener información de un administrador por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del administrador' })
  @ApiResponse({ status: 200, description: 'Información del administrador', type: Object }) // Cambia el tipo a Administrador si usas el modelo de Prisma
  @ApiResponse({ status: 404, description: 'Administrador no encontrado' })
  @ApiBearerAuth()

  async getUser(@Param('id') id: number) {
    const user = await this.administradorService.getUser(Number(id));
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  @Post('toggle-2fa/:id')
  @ApiOperation({ summary: 'Habilitar/Deshabilitar la autenticación de dos factores' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del administrador' })
  @ApiResponse({ status: 200, description: 'Estado 2FA actualizado', type: Object }) // Ajusta el tipo de respuesta según lo que retorne el servicio
  @ApiResponse({ status: 404, description: 'Administrador no encontrado' })
  @ApiBearerAuth()
  @Roles('administrador') // 🔒 Solo admins pueden acceder
  async toggle2FA(@Param('id') id: number) {
    return this.administradorService.toggle2FA(Number(id));
  }

}