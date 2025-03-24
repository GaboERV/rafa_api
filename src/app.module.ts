import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AdministradorModule } from './modules/administrador/administrador.module';

import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './jwt/auth.module';

import { MongooseModule } from '@nestjs/mongoose';
import { DashboardModule } from './iot/dashboard/dashboard.module';


@Module({
  imports: [
    AdministradorModule,
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot('mongodb://localhost/iot'),
    DashboardModule,
  ],

  providers: [AppService],
})
export class AppModule {}
