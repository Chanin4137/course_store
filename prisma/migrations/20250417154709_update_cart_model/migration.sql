/*
  Warnings:

  - You are about to drop the `CourseOnCart` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CourseOnCart" DROP CONSTRAINT "CourseOnCart_cartId_fkey";

-- DropForeignKey
ALTER TABLE "CourseOnCart" DROP CONSTRAINT "CourseOnCart_coursesId_fkey";

-- DropTable
DROP TABLE "CourseOnCart";

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "price" DOUBLE PRECISION NOT NULL,
    "cartId" TEXT NOT NULL,
    "coursesId" TEXT NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_coursesId_fkey" FOREIGN KEY ("coursesId") REFERENCES "Courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
