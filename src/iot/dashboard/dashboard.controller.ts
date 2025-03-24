import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { ApiResponse } from './dashboard.service'; // Import the ApiResponse type

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  private readonly logger = new Logger(DashboardController.name);

@Get()
  async getLastApiResponse(): Promise<ApiResponse> {
    const response = await this.dashboardService.getLastApiResponse();
    if (!response) {
      throw new Error('No API response available');
    }
    return response;
  }
  @Get("historico")
  async findAll() {
    this.logger.log('Obteniendo todos los datos históricos de sensores...');
    try {
      const data = await this.dashboardService.findAll();
      this.logger.log(`Encontrados ${data.length} registros históricos.`);
      return data;
    } catch (error) {
      this.logger.error('Error al obtener datos históricos:', error);
      throw error; // Re-lanza el error para que NestJS lo maneje (e.g., retornar un error 500)
    }
  }
@Get('deleteparcela')
async deleteParcela(): Promise<any> {
  try {
    const response = await this.dashboardService.getDeletedParcelas();
    if (!response) {
      this.logger.warn('No parcelas found to delete.');
      return { message: 'No parcelas found to delete.' };
    }
    return response;
  } catch (error) {
    this.logger.error('Error while deleting parcelas:', error);
    throw error; // Re-throw the error for NestJS to handle
  }
}
}