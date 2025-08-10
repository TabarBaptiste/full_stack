CREATE TYPE "Role" AS ENUM (
  'ADMIN',
  'CLIENT'
);

CREATE TYPE "ReservationStatus" AS ENUM (
  'PENDING',
  'CONFIRMED',
  'CANCELLED',
  'COMPLETED'
);

CREATE TYPE "PurchaseStatus" AS ENUM (
  'PENDING',
  'DELIVERED',
  'CANCELLED'
);

CREATE TABLE "User" (
  "id" varchar UNIQUE PRIMARY KEY,
  "email" varchar UNIQUE,
  "password" varchar,
  "firstname" varchar,
  "lastname" varchar,
  "role" "Role",
  "phone" varchar,
  "createdAt" datetime,
  "updatedAt" datetime
);

CREATE TABLE "Prestation" (
  "id" varchar PRIMARY KEY,
  "title" varchar,
  "description" text,
  "duration" int,
  "price" float,
  "createdAt" datetime,
  "updatedAt" datetime,
  "categoryId" varchar
);

CREATE TABLE "Product" (
  "id" varchar PRIMARY KEY,
  "name" varchar,
  "description" text,
  "price" float,
  "stock" int,
  "createdAt" datetime,
  "updatedAt" datetime,
  "categoryId" varchar
);

CREATE TABLE "Category" (
  "id" varchar PRIMARY KEY,
  "name" varchar,
  "description" text
);

CREATE TABLE "Reservation" (
  "id" varchar PRIMARY KEY,
  "startDate" datetime,
  "endDate" datetime,
  "status" "ReservationStatus",
  "price" float,
  "createdAt" datetime,
  "userId" varchar,
  "prestationId" varchar
);

CREATE TABLE "Purchase" (
  "id" varchar PRIMARY KEY,
  "createdAt" datetime,
  "status" "PurchaseStatus",
  "price" float,
  "userId" varchar,
  "productId" varchar
);

CREATE TABLE "Review" (
  "id" varchar PRIMARY KEY,
  "content" text,
  "rating" int,
  "visible" boolean,
  "createdAt" datetime,
  "userId" varchar
);

CREATE TABLE "RecurringSlot" (
  "id" varchar PRIMARY KEY,
  "dayOfWeek" int,
  "startTime" varchar,
  "endTime" varchar
);

CREATE TABLE "RecurringSlotException" (
  "id" varchar PRIMARY KEY,
  "date" datetime
);

CREATE TABLE "OneTimeSlot" (
  "id" varchar PRIMARY KEY,
  "date" datetime,
  "startTime" varchar,
  "endTime" varchar
);

ALTER TABLE "Reservation" ADD FOREIGN KEY ("userId") REFERENCES "User" ("id");

ALTER TABLE "Reservation" ADD FOREIGN KEY ("prestationId") REFERENCES "Prestation" ("id");

ALTER TABLE "Prestation" ADD FOREIGN KEY ("categoryId") REFERENCES "Category" ("id");

ALTER TABLE "Product" ADD FOREIGN KEY ("categoryId") REFERENCES "Category" ("id");

ALTER TABLE "Purchase" ADD FOREIGN KEY ("userId") REFERENCES "User" ("id");

ALTER TABLE "Purchase" ADD FOREIGN KEY ("productId") REFERENCES "Product" ("id");

ALTER TABLE "Review" ADD FOREIGN KEY ("userId") REFERENCES "User" ("id");
