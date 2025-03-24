import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AdministradorModule } from './modules/administrador/administrador.module';

import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './jwt/auth.module';


import { DashboardModule } from './iot/dashboard/dashboard.module';


@Module({
  imports: [
    AdministradorModule,
    PrismaModule,
    AuthModule,
    DashboardModule,
  ],

  providers: [AppService],
})
export class AppModule {}
