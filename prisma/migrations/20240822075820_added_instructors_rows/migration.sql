-- AlterTable
ALTER TABLE `Instructor` ADD COLUMN `videoImage` VARCHAR(191) NOT NULL DEFAULT '/public/images/classes/muay.jpg',
    ADD COLUMN `videoUrl` VARCHAR(191) NOT NULL DEFAULT 'https://www.youtube.com/watch?v=Ui6DJdr9TqU&t=75s';
