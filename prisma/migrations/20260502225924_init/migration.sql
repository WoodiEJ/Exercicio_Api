/*
  Warnings:

  - Made the column `volta` on table `emprestimo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `emprestimo` MODIFY `volta` DATETIME(3) NOT NULL;
