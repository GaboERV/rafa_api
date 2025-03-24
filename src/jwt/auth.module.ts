import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        JwtModule.register({
            secret: 'naranjajs',
            signOptions: { expiresIn: '6h' }, // Deshabilitar el tiempo de expiración
        }),
    ],
    exports: [JwtModule], // Exportamos JwtModule para que otros módulos puedan usar JwtService

})
export class AuthModule {}
