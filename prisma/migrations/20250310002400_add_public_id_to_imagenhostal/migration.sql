-- CreateTable
CREATE TABLE `Administrador` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `contrasena` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `Enable2FA` BOOLEAN NOT NULL DEFAULT true,
    `twoFACode` VARCHAR(191) NULL,
    `paypalEmail` VARCHAR(191) NULL,

    UNIQUE INDEX `Administrador_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pais` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Estado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `paisId` INTEGER NOT NULL,

    INDEX `Estado_paisId_fkey`(`paisId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Municipio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `estadoId` INTEGER NOT NULL,

    INDEX `Municipio_estadoId_fkey`(`estadoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hostal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `direccion` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `latitud` DOUBLE NOT NULL,
    `longitud` DOUBLE NOT NULL,
    `Municipio_id` INTEGER NOT NULL,
    `administrador_id` INTEGER NOT NULL,
    `descripcion` TEXT NOT NULL,

    INDEX `Hostal_Municipio_id_fkey`(`Municipio_id`),
    INDEX `Hostal_administrador_id_fkey`(`administrador_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tipo_Habitacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `capacidad` INTEGER NOT NULL,
    `precio` DOUBLE NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `hostal_id` INTEGER NOT NULL,

    INDEX `Tipo_Habitacion_hostal_id_fkey`(`hostal_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Habitacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estado` ENUM('DISPONIBLE', 'OCUPADA') NOT NULL,
    `tipo_habitacion_id` INTEGER NOT NULL,
    `idenficador` VARCHAR(191) NOT NULL,

    INDEX `Habitacion_tipo_habitacion_id_fkey`(`tipo_habitacion_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reserva` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha_entrada` DATETIME(3) NOT NULL,
    `fecha_salida` DATETIME(3) NOT NULL,
    `estatus` ENUM('PENDIENTE', 'CONFIRMADA', 'CANCELADA') NOT NULL,
    `precio` DOUBLE NOT NULL,
    `habitacion_id` INTEGER NOT NULL,
    `cliente_id` INTEGER NOT NULL,

    INDEX `Reserva_cliente_id_fkey`(`cliente_id`),
    INDEX `Reserva_habitacion_id_fkey`(`habitacion_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cliente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `Enable2FA` BOOLEAN NOT NULL DEFAULT true,
    `contrasena` VARCHAR(191) NOT NULL,
    `twoFACode` VARCHAR(191) NULL,

    UNIQUE INDEX `Cliente_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mensaje` VARCHAR(191) NOT NULL,
    `cliente_id` INTEGER NOT NULL,
    `hostal_id` INTEGER NOT NULL,

    INDEX `Review_cliente_id_fkey`(`cliente_id`),
    INDEX `Review_hostal_id_fkey`(`hostal_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImagenHostal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `public_id` VARCHAR(191) NULL,
    `hostal_id` INTEGER NOT NULL,

    INDEX `ImagenHostal_hostal_id_fkey`(`hostal_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImagenHabitacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `public_id` VARCHAR(191) NULL,
    `tipo_habitacion_id` INTEGER NOT NULL,

    INDEX `ImagenHabitacion_tipo_habitacion_id_fkey`(`tipo_habitacion_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImagenReview` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `public_id` VARCHAR(191) NULL,
    `review_id` INTEGER NOT NULL,

    INDEX `ImagenReview_review_id_fkey`(`review_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaypalInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` VARCHAR(191) NOT NULL,
    `transactionId` VARCHAR(191) NULL,
    `captureId` VARCHAR(191) NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `reservaId` INTEGER NOT NULL,

    UNIQUE INDEX `PaypalInfo_reservaId_key`(`reservaId`),
    INDEX `PaypalInfo_reservaId_idx`(`reservaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Refund` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paypalInfoId` INTEGER NOT NULL,
    `refundId` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Refund_paypalInfoId_idx`(`paypalInfoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Estado` ADD CONSTRAINT `Estado_paisId_fkey` FOREIGN KEY (`paisId`) REFERENCES `Pais`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Municipio` ADD CONSTRAINT `Municipio_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `Estado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Hostal` ADD CONSTRAINT `Hostal_Municipio_id_fkey` FOREIGN KEY (`Municipio_id`) REFERENCES `Municipio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Hostal` ADD CONSTRAINT `Hostal_administrador_id_fkey` FOREIGN KEY (`administrador_id`) REFERENCES `Administrador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tipo_Habitacion` ADD CONSTRAINT `Tipo_Habitacion_hostal_id_fkey` FOREIGN KEY (`hostal_id`) REFERENCES `Hostal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Habitacion` ADD CONSTRAINT `Habitacion_tipo_habitacion_id_fkey` FOREIGN KEY (`tipo_habitacion_id`) REFERENCES `Tipo_Habitacion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reserva` ADD CONSTRAINT `Reserva_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `Cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reserva` ADD CONSTRAINT `Reserva_habitacion_id_fkey` FOREIGN KEY (`habitacion_id`) REFERENCES `Habitacion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `Cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_hostal_id_fkey` FOREIGN KEY (`hostal_id`) REFERENCES `Hostal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImagenHostal` ADD CONSTRAINT `ImagenHostal_hostal_id_fkey` FOREIGN KEY (`hostal_id`) REFERENCES `Hostal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImagenHabitacion` ADD CONSTRAINT `ImagenHabitacion_tipo_habitacion_id_fkey` FOREIGN KEY (`tipo_habitacion_id`) REFERENCES `Tipo_Habitacion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImagenReview` ADD CONSTRAINT `ImagenReview_review_id_fkey` FOREIGN KEY (`review_id`) REFERENCES `Review`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaypalInfo` ADD CONSTRAINT `PaypalInfo_reservaId_fkey` FOREIGN KEY (`reservaId`) REFERENCES `Reserva`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Refund` ADD CONSTRAINT `Refund_paypalInfoId_fkey` FOREIGN KEY (`paypalInfoId`) REFERENCES `PaypalInfo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
