CREATE TABLE `User` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
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
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(255),
  `description` text,
  `duration` int,
  `price` float,
  `createdAt` datetime,
  `updatedAt` datetime,
  `categoryId` int
);

CREATE TABLE `Product` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `description` text,
  `price` float,
  `stock` int,
  `createdAt` datetime,
  `updatedAt` datetime,
  `categoryId` int
);

CREATE TABLE `Category` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `description` text
);

CREATE TABLE `Reservation` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `startDate` datetime,
  `endDate` datetime,
  `status` ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'),
  `price` float,
  `createdAt` datetime,
  `userId` int,
  `prestationId` int
);

CREATE TABLE `Order` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `createdAt` datetime,
  `status` ENUM ('PENDING', 'DELIVERED', 'CANCELLED'),
  `totalPrice` float,
  `userId` int
);

CREATE TABLE `OrderItem` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `quantity` int,
  `price` float,
  `createdAt` datetime,
  `orderId` int,
  `productId` int
);

CREATE TABLE `Review` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `content` text,
  `rating` int,
  `visible` boolean,
  `createdAt` datetime,
  `userId` int
);

CREATE TABLE `RecurringSlot` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `dayOfWeek` int,
  `startTime` varchar(255),
  `endTime` varchar(255)
);

CREATE TABLE `RecurringSlotException` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `date` datetime
);

CREATE TABLE `OneTimeSlot` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `date` datetime,
  `startTime` varchar(255),
  `endTime` varchar(255)
);

ALTER TABLE `Reservation` ADD FOREIGN KEY (`userId`) REFERENCES `User` (`id`);

ALTER TABLE `Reservation` ADD FOREIGN KEY (`prestationId`) REFERENCES `Prestation` (`id`);

ALTER TABLE `Prestation` ADD FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`);

ALTER TABLE `Product` ADD FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`);

ALTER TABLE `Order` ADD FOREIGN KEY (`userId`) REFERENCES `User` (`id`);

ALTER TABLE `OrderItem` ADD FOREIGN KEY (`orderId`) REFERENCES `Order` (`id`);

ALTER TABLE `OrderItem` ADD FOREIGN KEY (`productId`) REFERENCES `Product` (`id`);

ALTER TABLE `Review` ADD FOREIGN KEY (`userId`) REFERENCES `User` (`id`);
