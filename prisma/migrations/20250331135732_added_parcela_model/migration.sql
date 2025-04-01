/*
  Warnings:

  - You are about to drop the `Cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Estado` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Habitacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Hostal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImagenHabitacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImagenHostal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImagenReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Municipio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pais` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaypalInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Refund` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reserva` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tipo_Habitacion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Estado` DROP FOREIGN KEY `Estado_paisId_fkey`;

-- DropForeignKey
ALTER TABLE `Habitacion` DROP FOREIGN KEY `Habitacion_tipo_habitacion_id_fkey`;

-- DropForeignKey
ALTER TABLE `Hostal` DROP FOREIGN KEY `Hostal_Municipio_id_fkey`;

-- DropForeignKey
ALTER TABLE `Hostal` DROP FOREIGN KEY `Hostal_administrador_id_fkey`;

-- DropForeignKey
ALTER TABLE `ImagenHabitacion` DROP FOREIGN KEY `ImagenHabitacion_tipo_habitacion_id_fkey`;

-- DropForeignKey
ALTER TABLE `ImagenHostal` DROP FOREIGN KEY `ImagenHostal_hostal_id_fkey`;

-- DropForeignKey
ALTER TABLE `ImagenReview` DROP FOREIGN KEY `ImagenReview_review_id_fkey`;

-- DropForeignKey
ALTER TABLE `Municipio` DROP FOREIGN KEY `Municipio_estadoId_fkey`;

-- DropForeignKey
ALTER TABLE `PaypalInfo` DROP FOREIGN KEY `PaypalInfo_reservaId_fkey`;

-- DropForeignKey
ALTER TABLE `Refund` DROP FOREIGN KEY `Refund_paypalInfoId_fkey`;

-- DropForeignKey
ALTER TABLE `Reserva` DROP FOREIGN KEY `Reserva_cliente_id_fkey`;

-- DropForeignKey
ALTER TABLE `Reserva` DROP FOREIGN KEY `Reserva_habitacion_id_fkey`;

-- DropForeignKey
ALTER TABLE `Review` DROP FOREIGN KEY `Review_cliente_id_fkey`;

-- DropForeignKey
ALTER TABLE `Review` DROP FOREIGN KEY `Review_hostal_id_fkey`;

-- DropForeignKey
ALTER TABLE `Tipo_Habitacion` DROP FOREIGN KEY `Tipo_Habitacion_hostal_id_fkey`;

-- DropTable
DROP TABLE `Cliente`;

-- DropTable
DROP TABLE `Estado`;

-- DropTable
DROP TABLE `Habitacion`;

-- DropTable
DROP TABLE `Hostal`;

-- DropTable
DROP TABLE `ImagenHabitacion`;

-- DropTable
DROP TABLE `ImagenHostal`;

-- DropTable
DROP TABLE `ImagenReview`;

-- DropTable
DROP TABLE `Municipio`;

-- DropTable
DROP TABLE `Pais`;

-- DropTable
DROP TABLE `PaypalInfo`;

-- DropTable
DROP TABLE `Refund`;

-- DropTable
DROP TABLE `Reserva`;

-- DropTable
DROP TABLE `Review`;

-- DropTable
DROP TABLE `Tipo_Habitacion`;

-- CreateTable
CREATE TABLE `Parcela` (
    `id` INTEGER NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `ubicacion` VARCHAR(191) NOT NULL,
    `responsable` VARCHAR(191) NOT NULL,
    `tipo_cultivo` VARCHAR(191) NOT NULL,
    `ultimo_riego` VARCHAR(191) NOT NULL,
    `humedad` DOUBLE NOT NULL,
    `temperatura` DOUBLE NOT NULL,
    `lluvia` DOUBLE NOT NULL,
    `sol` INTEGER NOT NULL,
    `latitud` DOUBLE NOT NULL,
    `longitud` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
