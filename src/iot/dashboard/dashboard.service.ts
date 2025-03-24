// src/dashboard.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios, { AxiosResponse } from 'axios';

export interface ApiResponse {
    sensores: {
        humedad: number;
        temperatura: number;
        lluvia: number;
        sol: number;
    };
    parcelas: {
        id: number;
        nombre: string;
        ubicacion: string;
        responsable: string;
        tipo_cultivo: string;
        ultimo_riego: string;
        sensor: {
            humedad: number;
            temperatura: number;
            lluvia: number;
            sol: number;
        };
        latitud: number;
        longitud: number;
    }[];
}

@Injectable()
export class DashboardService {
    private readonly prisma: PrismaClient;
    private readonly logger = new Logger(DashboardService.name);
    private lastApiResponse: ApiResponse | null = null;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async fetchDataFromApi(): Promise<ApiResponse> {
        try {
            const apiUrl = 'https://moriahmkt.com/iotapp/test/'; // Reemplaza con la URL real de tu API
            const response: AxiosResponse<ApiResponse> = await axios.get(apiUrl);

            if (response.status !== 200) {
                throw new Error(`Error al obtener datos de la API: Status code ${response.status}`);
            }

            return response.data;

        } catch (error) {
            this.logger.error('Error al obtener datos de la API:', error);
            throw error;
        }
    }

    async findAll() {
        this.logger.log('Consultando todos los datos históricos de sensores en la base de datos...');
        try {
            const data = await this.prisma.sensorHistorico.findMany();
            this.logger.log(`Encontrados ${data.length} registros históricos en la base de datos.`);
            return data;
        } catch (error) {
            this.logger.error('Error al consultar datos históricos en la base de datos:', error);
            throw error; // Re-lanza el error
        }
    }

    async processData(): Promise<void> {
        try {
            const apiResponse = await this.fetchDataFromApi();

            // 1. Get all existing Parcela IDs from the database
            const existingParcelaIds = (await this.prisma.parcela.findMany()).map(p => p.id);

            // 2. Store current parcelas in the database
            await this.updateParcelas(apiResponse.parcelas);

            // 3. Identify deleted parcelas by comparing API data with existing IDs
            const currentParcelaIds = apiResponse.parcelas.map(p => p.id);
            const deletedIds = existingParcelaIds.filter(id => !currentParcelaIds.includes(id));

            // 4. Get data of the deleted parcelas, corroborating with Prisma
            const deletedParcelas = await this.getDeletedParcelasFromPrisma(deletedIds);

            // 5. Store deleted parcelas in the database and delete from Parcela table
            for (const parcela of deletedParcelas) {
                await this.prisma.deletedParcela.create({
                    data: {
                        id: parcela.id,
                        nombre: parcela.nombre,
                        ubicacion: parcela.ubicacion,
                        responsable: parcela.responsable,
                        tipo_cultivo: parcela.tipo_cultivo,
                        ultimo_riego: parcela.ultimo_riego,
                        humedad: parcela.humedad,
                        temperatura: parcela.temperatura,
                        lluvia: parcela.lluvia,
                        sol: parcela.sol,
                        latitud: parcela.latitud,
                        longitud: parcela.longitud,
                    },
                });

                // Delete the parcela from the Parcela table after moving it to DeletedParcela
                await this.prisma.parcela.delete({
                    where: { id: parcela.id },
                });
            }


            if (!this.areDataDifferent(apiResponse, this.lastApiResponse)) {
                this.logger.log('No hay cambios en los datos de los sensores generales de la API, no se guardan nuevos registros.');
                return;
            }

            this.logger.log('Detectados cambios en los datos de los sensores generales de la API. Procediendo a guardar los nuevos registros.');

            const now = new Date();
            const dia = now.toISOString().slice(0, 10);
            const hora = now.toLocaleTimeString();

            await this.prisma.sensorHistorico.create({
                data: {
                    humedad: apiResponse.sensores.humedad,
                    temperatura: apiResponse.sensores.temperatura,
                    lluvia: apiResponse.sensores.lluvia,
                    sol: apiResponse.sensores.sol,
                    fechaRegistro: now,
                    dia: dia,
                    hora: hora,
                },
            });

            this.lastApiResponse = apiResponse;
            this.logger.log('Datos generales de los sensores guardados correctamente.');

        } catch (error) {
            this.logger.error('Error al procesar los datos:', error);
        }
    }

    // Function to retrieve deleted parcelas from Prisma
    private async getDeletedParcelasFromPrisma(deletedIds: number[]): Promise<any[]> {
        try {
            return await this.prisma.parcela.findMany({
                where: {
                    id: {
                        in: deletedIds,
                    },
                },
            });
        } catch (error) {
            this.logger.error('Error fetching deleted parcelas from Prisma:', error);
            return [];
        }
    }


    private async updateParcelas(parcelas: any[]): Promise<void> {
        try {
            // Iterate through the parcelas and either create or update them in the database
            for (const parcela of parcelas) {
                await this.prisma.parcela.upsert({
                    where: { id: parcela.id },
                    update: {
                        nombre: parcela.nombre,
                        ubicacion: parcela.ubicacion,
                        responsable: parcela.responsable,
                        tipo_cultivo: parcela.tipo_cultivo,
                        ultimo_riego: parcela.ultimo_riego,
                        humedad: parcela.sensor.humedad,
                        temperatura: parcela.sensor.temperatura,
                        lluvia: parcela.sensor.lluvia,
                        sol: parcela.sensor.sol,
                        latitud: parcela.latitud,
                        longitud: parcela.longitud,
                    },
                    create: {
                        id: parcela.id,
                        nombre: parcela.nombre,
                        ubicacion: parcela.ubicacion,
                        responsable: parcela.responsable,
                        tipo_cultivo: parcela.tipo_cultivo,
                        ultimo_riego: parcela.ultimo_riego,
                        humedad: parcela.sensor.humedad,
                        temperatura: parcela.sensor.temperatura,
                        lluvia: parcela.sensor.lluvia,
                        sol: parcela.sensor.sol,
                        latitud: parcela.latitud,
                        longitud: parcela.longitud,
                    },
                });
            }

            this.logger.log('Parcelas updated/created successfully.');
        } catch (error) {
            this.logger.error('Error updating/creating parcelas:', error);
            throw error;
        }
    }

    private areDataDifferent(newApiResponse: ApiResponse, lastApiResponse: ApiResponse | null): boolean {
        if (!lastApiResponse) {
            return true;
        }

        if (
            newApiResponse.sensores.humedad !== lastApiResponse.sensores.humedad ||
            newApiResponse.sensores.temperatura !== lastApiResponse.sensores.temperatura ||
            newApiResponse.sensores.lluvia !== lastApiResponse.sensores.lluvia ||
            newApiResponse.sensores.sol !== lastApiResponse.sensores.sol
        ) {
            return true;
        }

        return false;
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async handleCron() {
        this.logger.debug('Tarea programada ejecutándose...');
        await this.processData();
    }
    // Función modificada para obtener las parcelas eliminadas de la base de datos
    async getDeletedParcelas(): Promise<any[]> {
        try {
            return await this.prisma.deletedParcela.findMany();
        } catch (error) {
            this.logger.error('Error al obtener las parcelas eliminadas de la base de datos:', error);
            return [];
        }
    }
    async getLastApiResponse(): Promise<ApiResponse | null> {
        return this.lastApiResponse;
    }
}