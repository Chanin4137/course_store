/*
  Warnings:

  - You are about to drop the column `rold` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "rold",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'User';
