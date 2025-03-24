// src/administrador/administrador.service.ts
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as crypto from 'crypto';
import { EmailService } from 'src/email/email.service';
import { LoginUserDto } from './dto/login-user';
import { CreateAdministradorDto } from './dto/create-administrador.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config'; // Importa ConfigService
import axios from 'axios'; // Importa axios

@Injectable()
export class AdministradorService {
  private readonly logger = new Logger(AdministradorService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private jwtService: JwtService,
    private readonly configService: ConfigService, // Inyecta ConfigService
  ) {}

  private generate2FACode(): string {
    // Genera un código de 6 dígitos para 2FA
    return crypto.randomInt(100000, 999999).toString(); // 6 dígitos aleatorios
  }
  getPerfil(req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access
    return req.user;
  }
  async login(loginUserDto: LoginUserDto) {
    const { email, contrasena } = loginUserDto;

    const user = await this.prisma.administrador.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    if (user.Enable2FA) {
      const twoFACode = this.generate2FACode();
      await this.prisma.administrador.update({
        where: { id: user.id },
        data: { twoFACode },
      });

      await this.emailService.send2FACode(user.email, twoFACode);

      setTimeout(
        async () => {
          await this.prisma.administrador.update({
            where: { id: user.id },
            data: { twoFACode: null },
          });
        },
        10 * 60 * 1000,
      ); // 10 minutos

      return {
        Id: user.id,
        message: 'Se ha enviado un código 2FA a tu correo electrónico.',
      };
    } else {
      return this.generateTokenResponse(user);
    }
  }

  // Registro de nuevo administrador
  async registro(registerUserDto: CreateAdministradorDto) {
    const { email, contrasena, telefono, nombre } = registerUserDto;

    // Verificar si el correo ya está en uso
    const existingUser = await this.prisma.administrador.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('El correo ya está en uso');
    }

    // Expresión regular para validar la contraseña
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(contrasena)) {
      throw new ConflictException(
        'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial. No puede contener espacios.',
      );
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    try {
      // Guardar los datos directamente en la tabla de Administrador
      const createdUser = await this.prisma.administrador.create({
        data: {
          nombre,
          email,
          telefono,
          contrasena: hashedPassword,
        },
      });

      return {
        createdUser,
      };
    } catch (error) {
      throw new Error(
        'Error al registrar el usuario. Por favor, inténtalo de nuevo.',
      );
    }
  }

  async verify2FACode(userId: number, code: string) {
    const user = await this.prisma.administrador.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    if (user.twoFACode == null) {
      throw new UnauthorizedException('2FA no habilitado');
    }
    if (user.twoFACode !== code) {
      throw new UnauthorizedException('Código de verificación incorrecto');
    }

    await this.prisma.administrador.update({
      where: { id: user.id },
      data: { twoFACode: null },
    });

    return this.generateTokenResponse(user);
  }
  private generateTokenResponse(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      Enable2FA: user.Enable2FA,
      rol: 'administrador',
    };
    const token = this.jwtService.sign(payload); // Generar token JWT

    return {
      token,
    };
  }

  async getUser(id: number) {
    return this.prisma.administrador.findFirst({
      where: {
        id: id,
      },
    });
  }

  async toggle2FA(id: number) {
    const user = await this.prisma.administrador.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const updatedUser = await this.prisma.administrador.update({
      where: { id },
      data: { Enable2FA: !user.Enable2FA },
    });

    return { Enable2FA: updatedUser.Enable2FA };
  }

  async updatePaypalAccount(
    adminId: number,
    paypalEmail: string,
  ): Promise<any> {
    try {
      // 1. Validar con PayPal API
      await this.validatePaypalEmail(paypalEmail);

      // 2. Si la validación es exitosa, guardar en la base de datos
      const updatedAdmin = await this.prisma.administrador.update({
        where: { id: adminId },
        data: { paypalEmail: paypalEmail },
      });

      return {
        message: 'Cuenta de PayPal actualizada con éxito',
        paypalEmail: updatedAdmin.paypalEmail,
      };
    } catch (error) {
      this.logger.error('Error al actualizar la cuenta de PayPal:', error);
      throw error; // Re-lanza el error para que el controlador lo maneje
    }
  }
  // src/administrador/administrador.service.ts
  // ... (resto del código) ...
  s;
  private async validatePaypalEmail(paypalEmail: string): Promise<void> {
    const clientId = this.configService.get<string>('PAYPAL_CLIENT_ID');
    const clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET');
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    // Verificar si las credenciales están presentes
    if (!clientId || !clientSecret) {
      this.logger.error('Credenciales de PayPal no configuradas.');
      throw new Error(
        'Error de configuración: Credenciales de PayPal no encontradas.',
      );
    }

    // 1. Obtener un token de acceso
    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64',
    );
    const tokenUrl = isProduction
      ? 'https://api.paypal.com/v1/oauth2/token'
      : 'https://api.sandbox.paypal.com/v1/oauth2/token';

    try {
      const tokenResponse = await axios.post(
        tokenUrl,
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${authString}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const accessToken = tokenResponse.data.access_token;

      // 2. Intentar crear una orden con el correo electrónico
      const ordersUrl = isProduction
        ? 'https://api.paypal.com/v2/checkout/orders'
        : 'https://api.sandbox.paypal.com/v2/checkout/orders';

      const orderData = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'MXN', // Cambiar a MXN
              value: '1.00', // Un monto pequeño
            },
            payee: {
              email_address: paypalEmail,
            },
          },
        ],
      };

      const orderResponse = await axios.post(ordersUrl, orderData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      // Si la creación de la orden es exitosa, la cuenta es válida
      if (orderResponse.status === 201) {
        this.logger.log('Cuenta de PayPal validada con éxito.');
        // OJO: Es importante cancelar o void la orden inmediatamente después de la validación
        //      para no afectar la cuenta del usuario.  Esta lógica no está incluida aquí,
        //      pero debe implementarse en un entorno de producción.
        return;
      } else {
        this.logger.warn(
          `La validación del correo electrónico de PayPal falló con el código de estado: ${orderResponse.status}`,
        );
        throw new BadRequestException(
          'La cuenta de PayPal no es válida o no existe.',
        );
      }
    } catch (error) {
      this.logger.error('Error al validar la cuenta de PayPal:', error.message);
      // Analiza el error para determinar si es un problema con la cuenta o un error diferente
      if (
        error.response &&
        error.response.data &&
        error.response.data.details
      ) {
        const details = error.response.data.details;
        const invalidAccount = details.some(
          (detail) =>
            detail.issue === 'PAYEE_ACCOUNT_RESTRICTED' ||
            detail.issue === 'PAYEE_ACCOUNT_LOCKED',
        );

        if (invalidAccount) {
          throw new BadRequestException(
            'La cuenta de PayPal no es válida o está restringida.',
          );
        }
      }
      throw new BadRequestException(
        'La cuenta de PayPal no es válida o no existe.',
      );
    }
  }
}
