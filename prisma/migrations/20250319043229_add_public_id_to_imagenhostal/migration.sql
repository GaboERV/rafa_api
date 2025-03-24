-- CreateTable
CREATE TABLE `SensorHistorico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `humedad` DOUBLE NOT NULL,
    `temperatura` DOUBLE NOT NULL,
    `lluvia` DOUBLE NOT NULL,
    `sol` INTEGER NOT NULL,
    `fechaRegistro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dia` VARCHAR(191) NULL,
    `hora` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeletedParcela` (
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
    `fechaEliminacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParcelaHistorico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parcelaId` INTEGER NOT NULL,
    `humedad` DOUBLE NOT NULL,
    `temperatura` DOUBLE NOT NULL,
    `lluvia` DOUBLE NOT NULL,
    `sol` INTEGER NOT NULL,
    `fechaRegistro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dia` VARCHAR(191) NULL,
    `hora` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
