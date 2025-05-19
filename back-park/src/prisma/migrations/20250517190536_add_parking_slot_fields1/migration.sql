/*
  Warnings:

  - Added the required column `location` to the `ParkingSlot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `ParkingSlot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleType` to the `ParkingSlot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ParkingSlot" ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'available',
ADD COLUMN     "vehicleType" TEXT NOT NULL;
