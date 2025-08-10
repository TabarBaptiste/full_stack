/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Category` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Purchase` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Purchase` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `RecurringSlot` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `RecurringSlot` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Reservation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Reservation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `categoryId` on the `Prestation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `categoryId` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."Prestation" DROP CONSTRAINT "Prestation_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- AlterTable
ALTER TABLE "public"."Category" DROP CONSTRAINT "Category_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Prestation" DROP COLUMN "categoryId",
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "categoryId",
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Purchase" DROP CONSTRAINT "Purchase_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."RecurringSlot" DROP CONSTRAINT "RecurringSlot_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "RecurringSlot_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Reservation" DROP CONSTRAINT "Reservation_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "public"."Prestation" ADD CONSTRAINT "Prestation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
