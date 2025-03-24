import { Module } from '@nestjs/common';
import { AdministradorService } from './administrador.service';
import { AdministradorController } from './administrador.controller';
import { EmailModule } from 'src/email/email.module';
import { AuthModule } from 'src/jwt/auth.module';

@Module({
  imports: [
    EmailModule,AuthModule
  ],
  controllers: [AdministradorController],
  providers: [AdministradorService],
})
export class AdministradorModule {}
