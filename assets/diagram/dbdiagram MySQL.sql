CREATE TABLE `User` (
  `id` varchar(255) UNIQUE PRIMARY KEY,
  `email` varchar(255) UNIQUE,
  `password` varchar(255),
  `firstname` varchar(255),
  `lastname` varchar(255),
  `role` ENUM ('ADMIN', 'CLIENT'),
  `phone` varchar(255),
  `createdAt` datetime,
  `updatedAt` datetime
);

CREATE TABLE `Prestation` (
  `id` varchar(255) PRIMARY KEY,
  `title` varchar(255),
  `description` text,
  `duration` int,
  `price` float,
  `createdAt` datetime,
  `updatedAt` datetime,
  `categoryId` varchar(255)
);

CREATE TABLE `Product` (
  `id` varchar(255) PRIMARY KEY,
  `name` varchar(255),
  `description` text,
  `price` float,
  `stock` int,
  `createdAt` datetime,
  `updatedAt` datetime,
  `categoryId` varchar(255)
);

CREATE TABLE `Category` (
  `id` varchar(255) PRIMARY KEY,
  `name` varchar(255),
  `description` text
);

CREATE TABLE `Reservation` (
  `id` varchar(255) PRIMARY KEY,
  `startDate` datetime,
  `endDate` datetime,
  `status` ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'),
  `price` float,
  `createdAt` datetime,
  `userId` varchar(255),
  `prestationId` varchar(255)
);

CREATE TABLE `Purchase` (
  `id` varchar(255) PRIMARY KEY,
  `createdAt` datetime,
  `status` ENUM ('PENDING', 'DELIVERED', 'CANCELLED'),
  `price` float,
  `userId` varchar(255),
  `productId` varchar(255)
);

CREATE TABLE `Review` (
  `id` varchar(255) PRIMARY KEY,
  `content` text,
  `rating` int,
  `visible` boolean,
  `createdAt` datetime,
  `userId` varchar(255)
);

CREATE TABLE `RecurringSlot` (
  `id` varchar(255) PRIMARY KEY,
  `dayOfWeek` int,
  `startTime` varchar(255),
  `endTime` varchar(255)
);

CREATE TABLE `RecurringSlotException` (
  `id` varchar(255) PRIMARY KEY,
  `date` datetime
);

CREATE TABLE `OneTimeSlot` (
  `id` varchar(255) PRIMARY KEY,
  `date` datetime,
  `startTime` varchar(255),
  `endTime` varchar(255)
);

ALTER TABLE `Reservation` ADD FOREIGN KEY (`userId`) REFERENCES `User` (`id`);

ALTER TABLE `Reservation` ADD FOREIGN KEY (`prestationId`) REFERENCES `Prestation` (`id`);

ALTER TABLE `Prestation` ADD FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`);

ALTER TABLE `Product` ADD FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`);

ALTER TABLE `Purchase` ADD FOREIGN KEY (`userId`) REFERENCES `User` (`id`);

ALTER TABLE `Purchase` ADD FOREIGN KEY (`productId`) REFERENCES `Product` (`id`);

ALTER TABLE `Review` ADD FOREIGN KEY (`userId`) REFERENCES `User` (`id`);
