-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: May 15, 2024 at 05:30 AM
-- Server version: 5.7.39
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ultimate`
--

-- --------------------------------------------------------

--
-- Table structure for table `Account`
--
INSERT INTO Schedule (time, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday) VALUES
('9:00', 'Allenamento libero: 9:00 - 12:00', '', '', '', '', 'Allenamento libero: 9:00 - 12:00'),
('11:00', 'Pugilato/Kickboxing: 11:00 - 12:30', '', 'Pugilato/Kickboxing: 11:00 - 12:30', '', '', ''),
('13:00', 'Pugilato Adulti: 13:00 - 14:00', '', '', '', '', ''),
('17:00', 'Muay Thai Bambini: 17:00 - 18:00', 'Pugilato Bambini: 17:00 - 18:00', 'Muay Thai Bambini: 17:00 - 18:00', 'Pugilato Bambini: 17:00 - 18:00', 'Muay Thai Bambini: 17:00 - 18:00', ''),
('18:00', 'Muay Thai Adulti: 18:00 - 19:00', 'Pugilato Adulti: 18:00 - 19:30', 'Muay Thai Adulti: 18:00 - 19:00', 'Pugilato Adulti: 18:00 - 19:30', 'Muay Thai Adulti: 18:00 - 19:00', ''),
('19:00', 'Pugilato Adulti: 19:00 - 20:00', '', '', 'MMA: 19:30 - 20:30', 'Sparring Agonisti: 19:00 - 20:00', '');

CREATE TABLE `Account` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `providerAccountId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `refresh_token` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `access_token` text COLLATE utf8mb4_unicode_ci,
  `expires_at` int(11) DEFAULT NULL,
  `token_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scope` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_token` text COLLATE utf8mb4_unicode_ci,
  `session_state` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Asset`
--

CREATE TABLE `Asset` (
  `id` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `lecture_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `asset_zip` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `Announcement` (
  `id` int(11) NOT NULL,
  `homeAnnouncement` varchar(191),
  `scheduleAnnouncement` varchar(191),
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Announcement` (`id`, `homeAnnouncement`, `scheduleAnnouncement`, `created_at`, `updated_at`) VALUES
(1, 'Home Announcement!', 'Corso MMA in arrivo', '2024-05-08 04:09:45.316', '2024-05-08 04:09:45.316');

--
-- Dumping data for table `Asset`
--

INSERT INTO `Asset` (`id`, `courseId`, `lecture_name`, `asset_zip`, `created_at`, `updated_at`) VALUES
(1, 2, 'Project Mockup', 'https://res.cloudinary.com/dev-empty/raw/upload/v1715141362/ecypsp9eissj2r7gqoex.zip', '2024-05-08 04:09:45.316', '2024-05-08 04:09:45.316'),
(2, 2, 'Day 2', 'https://res.cloudinary.com/dev-empty/raw/upload/v1715141401/nlafpagwtskrluzkrubb.zip', '2024-05-08 04:10:47.141', '2024-05-08 04:10:47.141'),
(4, 2, 'Project catelog', 'https://res.cloudinary.com/dev-empty/raw/upload/v1715142856/c4kpynckqmgeyos3t5zv.zip', '2024-05-08 04:34:18.331', '2024-05-08 04:34:18.331'),
(5, 5, 'Day 1', 'https://res.cloudinary.com/dev-empty/raw/upload/v1715747727/beuhpy521glcx5ih4tfu.zip', '2024-05-15 04:35:29.839', '2024-05-15 04:35:29.839');

-- --------------------------------------------------------

--
-- Table structure for table `Category`
--

CREATE TABLE `Category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Dumping data for table `Category`
DROP TABLE `Category`;
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `image`, `created_at`, `updated_at`) VALUES
(1, 'Pugilato', 'Pugilato', 'Boxing is a combat sport in which two people throw punches at each other for a predetermined amount of time.', '/images/classes/box.jpg', '2024-05-07 09:36:02.000', '2024-05-07 09:36:02.000'),
(2, 'Kick Box', 'kick-box', 'Kickboxing is a group of stand-up combat sports based on kicking and punching.', '/images/classes/box.jpg', '2024-05-07 09:36:42.000', '2024-05-07 09:36:42.000'),
(3, 'MMA', 'mma', 'Mixed Martial Arts (MMA) is a full-contact combat sport that allows a wide variety of fighting techniques from various disciplines.', '/images/classes/box.jpg', '2024-05-07 09:37:21.000', '2024-05-07 09:37:21.000'),
(4, 'Muay Thai', 'muay-thai', 'Muay Thai, or Thai boxing, is a combat sport from Thailand that uses stand-up striking along with various clinching techniques.', '/images/classes/box.jpg', '2024-05-07 09:37:41.000', '2024-05-07 09:37:41.000'),
(5, 'Grappling', 'grappling', 'Grappling refers to techniques, maneuvers, and counters applied to an opponent in order to gain a physical advantage.', '/images/classes/box.jpg', '2024-05-07 09:38:05.000', '2024-05-07 09:38:05.000'),
(6, 'Crossfit', 'crossfit', 'CrossFit is a high-intensity fitness program incorporating elements from several sports and types of exercise.', '/images/classes/box.jpg', '2024-05-07 09:38:17.000', '2024-05-07 09:38:17.000');
DROP TABLE Instructor;
CREATE TABLE `Instructor` (
  `id` int(11) NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `videoImage` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `videoUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ALTER TABLE Instructor ADD COLUMN discipline_id INT;
-- UPDATE Instructor
-- JOIN Category ON Instructor.discipline = Category.name
-- SET Instructor.discipline_id = Category.id;
-- ALTER TABLE Instructor DROP COLUMN discipline;
-- ALTER TABLE Instructor CHANGE COLUMN discipline_id discipline INT;
-- ALTER TABLE Instructor
-- ADD CONSTRAINT fk_category
-- FOREIGN KEY (discipline) REFERENCES Category(id);


--
-- Dumping data for table `Instructor`
--

INSERT INTO `Instructor` (`id`, `name`, `image`, `description`, `created_at`, `updated_at`) VALUES
(2, 'Lucian Danilencu', '/images/instructors/lucian.jpg', 'Many stations repurpose their content in podcast episodes. Offering a platform to listen to a down leas these podcast’s can help reach a broader audience. Links to the station social media profiles allow users to connect and interact in this business website design.', '2024-05-13 08:36:52.591', '2024-05-13 08:44:21.088'),
(3, 'Buakaw Banchamek', '/images/instructors/buakaw.jpeg', 'Many stations repurpose their content in podcast episodes. Offering a platform to listen to a down leas these podcast’s can help reach a broader audience. Links to the station social media profiles allow users to connect and interact in this business website design.', '2024-05-13 08:37:26.670', '2024-05-13 08:37:26.670'),
(4, 'Mike Tyson', '/images/instructors/tyson.jpg', 'Many stations repurpose their content in podcast episodes. Offering a platform to listen to a down leas these podcast’s can help reach a broader audience. Links to the station social media profiles allow users to connect and interact in this business website design.', '2024-05-13 08:37:53.609', '2024-05-13 08:37:53.609');


DROP TABLE CategoryInstructors;
CREATE TABLE `CategoryInstructors` (
  `categoryId` INT NOT NULL,
  `instructorId` INT NOT NULL,
  PRIMARY KEY (`categoryId`, `instructorId`),
  CONSTRAINT `CategoryInstructors_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`) ON DELETE CASCADE,
  CONSTRAINT `CategoryInstructors_instructorId_fkey` FOREIGN KEY (`instructorId`) REFERENCES `Instructor` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;STRAINT `CategoryInstructors_instructorId_fkey` FOREIGN KEY (`instructorId`) REFERENCES `Instructor` (`id`) ON DELETE CASCADE
);

INSERT INTO `CategoryInstructors` (`categoryId`, `instructorId`) VALUES
(1, 4),  -- Mike Tyson teaches Box
(2, 3),  -- Buakaw Banchamek teaches Kick Box
(3, 3),  -- Buakaw Banchamek teaches MMA
(4, 3),  -- Buakaw Banchamek teaches Muay Thai
(5, 2),  -- Lucian Danilencu teaches Grappling
(6, 2);  -- Lucian Danilencu teaches Crossfit
DROP TABLE event;
--
-- Table structure for table `Event`
--
CREATE TABLE `Event` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `time` datetime(3) NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `venue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `organizer` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



INSERT INTO `Event` (`id`, `name`, `image`, `description`, `time`, `venue`, `organizer`, `phone`, `address`, `created_at`, `updated_at`) VALUES
(5, 'Annual Fitness Expo', '/images/event-img1.jpg', 'An event showcasing the latest trends in fitness, health, and wellness.', '2024-05-13 09:00:00.000', 'Convention Center', 'FitLife Inc.', '555-123-4567', '123 Fitness St, Fit City', '2024-05-13 09:00:00.000', '2024-05-13 09:00:00.000'),
(6, 'Global Martial Arts Summit', '/images/event-img2.jpg', 'A gathering of martial arts practitioners from around the world.', '2024-05-13 09:15:00.000', 'International Arena', 'Martial World Federation', '555-234-5678', '456 Martial Way, Kicktown', '2024-05-13 09:15:00.000', '2024-05-13 09:15:00.000'),
(7, 'Wellness and Yoga Retreat', '/images/event-img3.jpg', 'A relaxing weekend of yoga and wellness activities.', '2024-05-13 09:30:00.000', 'Seaside Resort', 'Yoga Bliss', '555-345-6789', '789 Ocean Dr, Seaside', '2024-05-13 09:30:00.000', '2024-05-13 09:30:00.000'),
(8, 'Tech Innovators Conference', '/images/event-img4.jpg', 'Exploring the future of technology and innovation.', '2024-05-13 09:45:00.000', 'Tech Park', 'Innovatech', '555-456-7890', '101 Tech Ave, Silicon Valley', '2024-05-13 09:45:00.000', '2024-05-13 09:45:00.000'),
(9, 'Culinary Arts Festival', '/images/event-img5.jpg', 'Celebrating the art of cooking with top chefs.', '2024-05-13 10:00:00.000', 'Gourmet Plaza', 'Culinary Creations', '555-567-8901', '202 Gourmet Blvd, Foodie City', '2024-05-13 10:00:00.000', '2024-05-13 10:00:00.000'),
(10, 'Music and Arts Fair', '/images/event-img6.jpg', 'A festival of music, art, and culture.', '2024-05-13 10:15:00.000', 'Central Park', 'Arts Unlimited', '555-678-9012', '303 Art St, Music Town', '2024-05-13 10:15:00.000', '2024-05-13 10:15:00.000'),
(11, 'International Film Festival', '/images/event-img7.jpg', 'Showcasing films from around the world.', '2024-05-13 10:30:00.000', 'Cinema Complex', 'Global Films', '555-789-0123', '404 Cinema Rd, Movieland', '2024-05-13 10:30:00.000', '2024-05-13 10:30:00.000'),
(12, 'Environmental Conservation Summit', '/images/event-img8.jpg', 'Discussing strategies for environmental protection.', '2024-05-13 10:45:00.000', 'Eco Center', 'Green Earth Org.', '555-890-1234', '505 Green St, Ecotown', '2024-05-13 10:45:00.000', '2024-05-13 10:45:00.000'),
(13, 'Digital Marketing Expo', '/images/event-img9.jpg', 'Exploring the latest trends in digital marketing.', '2024-05-13 11:00:00.000', 'Business Hub', 'Marketing Masters', '555-901-2345', '606 Market St, Biz City', '2024-05-13 11:00:00.000', '2024-05-13 11:00:00.000'),
(14, 'Science and Innovation Fair', '/images/event-img10.jpg', 'A showcase of scientific discoveries and innovations.', '2024-05-13 11:15:00.000', 'Science Hall', 'Innovators Network', '555-012-3456', '707 Science Blvd, Techville', '2024-05-13 11:15:00.000', '2024-05-13 11:15:00.000'),
(15, 'Sports and Fitness Expo', '/images/event-img11.jpg', 'Highlighting the latest in sports and fitness equipment.', '2024-05-13 11:30:00.000', 'Sports Arena', 'Active Life', '555-123-4568', '808 Sports St, Fit Town', '2024-05-13 11:30:00.000', '2024-05-13 11:30:00.000'),
(16, 'Literature and Book Fair', '/images/event-img12.jpg', 'A celebration of books and literature.', '2024-05-13 11:45:00.000', 'Library Plaza', 'Book Lovers', '555-234-5679', '909 Book Rd, Read City', '2024-05-13 11:45:00.000', '2024-05-13 11:45:00.000');

-- --------------------------------------------------------

--
-- Table structure for table `Coupon`
--

CREATE TABLE `Coupon` (
  `id` int(11) NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount` double NOT NULL,
  `exp_date` datetime(3) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `active_for_full_site` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Course`
--

DROP TABLE Course;
CREATE TABLE `Course` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `catId` int(11) NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `overview` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `regular_price` double DEFAULT NULL,
  `before_price` double DEFAULT NULL,
  `is_free` tinyint(1) NOT NULL DEFAULT '0',
  `lessons` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `access_time` enum('Lifetime','Three_Months','Six_Months','One_Year') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Lifetime',
  `requirements` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `what_you_will_learn` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `who_is_this_course_for` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `approved` tinyint(1) NOT NULL DEFAULT '0',
  `in_home_page` tinyint(1) NOT NULL DEFAULT '0',
  `is_class` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Course`
--

INSERT INTO `Course` (`id`, `userId`, `catId`, `title`, `slug`, `overview`, `regular_price`, `before_price`, `is_free`, `lessons`, `duration`, `image`, `access_time`, `requirements`, `what_you_will_learn`, `who_is_this_course_for`, `approved`, `in_home_page`, `is_class`, `created_at`, `updated_at`) VALUES
(1, 8, 1, 'Build Muscle Without A Gym', 'build-muscle-without-a-gym', 'Are you stuck in the cycle of endless gym hours, ineffective workouts, and frustrating diet plans? If you\'ve battled the \"skinny-fat\" struggle, just like I did years ago, I\'ve got some game-changing insights for you.  I used to spend countless hours in the gym doing pointless cardio, neglecting protein intake, and sweating over the wrong exercises, all while failing to track my progress. The mirror was a constant source of disappointment.  I dabbled in \"celebrity diets,\" attempted clean eating, and even flirted with programs promising miraculous \"hacks\" and \"shortcuts,\" not to mention fat burners that vowed to \"melt away fat.\" I blamed my corporate night shifts, erratic sleep, and supposedly \"skinny\" genetics for my lack of progress.  But when I took matters into my own hands, educated myself, and put the nutrition and training principles you\'ll find in this program into action, the transformation was nothing short of remarkable – all while enduring those gruelling night shifts. In fact, my newfound physique even clinched first place in my first bodybuilding competition.', 199, 499, 0, '44', '1h 53m', 'https://res.cloudinary.com/dev-empty/image/upload/v1715065513/o0lk0vlvwttnz5qaidp6.jpg', 'Lifetime', '', 'As far as the teaching goes it is exactly what I had hoped for. The simplicity in explanation makes it far easier for a beginner like myself to follow, understand, and go back to when I need it. The believability of the course is ultimately the best part about it. I feel like I can trust Felix in what he is saying. I look forward to continuing this path.', '', 1, 0, 0, '2024-05-07 07:06:05.693', '2024-05-13 05:27:04.393'),
(2, 8, 2, 'Ultimate Body Transformation', 'ultimate-body-transformation', 'Are you stuck in the cycle of endless gym hours, ineffective workouts, and frustrating diet plans? If you\'ve battled the \"skinny-fat\" struggle, just like I did years ago, I\'ve got some game-changing insights for you.  I used to spend countless hours in the gym doing pointless cardio, neglecting protein intake, and sweating over the wrong exercises, all while failing to track my progress. The mirror was a constant source of disappointment.  I dabbled in \"celebrity diets,\" attempted clean eating, and even flirted with programs promising miraculous \"hacks\" and \"shortcuts,\" not to mention fat burners that vowed to \"melt away fat.\" I blamed my corporate night shifts, erratic sleep, and supposedly \"skinny\" genetics for my lack of progress.  But when I took matters into my own hands, educated myself, and put the nutrition and training principles you\'ll find in this program into action, the transformation was nothing short of remarkable – all while enduring those gruelling night shifts. In fact, my newfound physique even clinched first place in my first bodybuilding competition.', 150, 299, 0, '156', ' 28h 7m', 'https://res.cloudinary.com/dev-empty/image/upload/v1715065743/ysuca3p72syocncnh85p.jpg', 'Lifetime', '', 'Navigating the fitness world is challenging, with a maze of harmful lies and myths to contend with. I\'ve been there, and I know how overwhelming it can be. That\'s why I\'ve distilled the complex science from the broscience to create a program rooted in tried-and-true principles that have shaped the fittest people on the planet.', '', 1, 0, 0, '2024-05-07 07:09:33.079', '2024-05-13 05:28:55.842'),
(3, 8, 3, '4-week Home Workout Program', '4-week-home-workout-program', 'Fortunately, I am in the beautiful country of Thailand during the filming of this course. :) \n\nIn the body weight & HIIT workouts videos that I have created for you, you\'ll be able to enjoy the sound of birds chirping in the park, soothing sound of waves on the beach, besides other things...\n\nOk, let\'s get serious now. \n\nWe all know that you don\'t need a gym to get fit and lose weight. \n\nWhat about building muscle?\n\nSure, you can build muscle with bodyweight training, but there is a limit. Let me be honest: If you need a body like me, then you need to hit the weights!\n\nBut, if your desire is to lose weight (and lot\'s of it), tone up, shape up and get super-fit, this course is for you. \n\nHere are the benefits that will accrue to you when you complete this 4-week program in a manner I recommend, then:\n\n- You\'ll be able to lose 2 lbs of fat per week (8 lbs in total). Weight loss will be more as there will be some water weight too!\n\n- You\'ll get super-fit\n\n-You\'ll work your fast twitch and very fast twitch muscle fibres which otherwise don\'t get worked when you are simply doing cardio\n\n-As a result, your body will release a lot of human growth hormone which helps boost testosterone. All this will help you build muscle faster and also make you look younger:)\n\n(HGH is also called the \'Fountain of Youth\')\n\n-You\'ll SAVE a lot of time. No gym means no traffic!\n\n-You\'ll SAVE a ton of money. I will be your personal trainer in each video, motivating, guiding you throughout. \n\nThe videos are follow-along. All you need to do is simply follow me along and keep your ear open to the tips and suggestions I keep giving while working out, and you\'ll be fine!\n\nI\'ll also immediately reply to any doubts or queries. \n\nLot of money saved on Personal coaching\n\nMoney saved by not joining a gym\n\nYou get the point. ', 149, 348, 0, '156', '5h 35m', 'https://res.cloudinary.com/dev-empty/image/upload/v1715673290/zi45yg312sjnnq83o8ll.jpg', 'Six_Months', '', 'Yoga Mat\nWillingness to tolerate some discomfort [as HIIT workouts are pretty intense!]', '', 1, 0, 0, '2024-05-14 07:55:14.802', '2024-05-14 07:59:41.075'),
(4, 8, 4, 'Weight Loss with Professionals!', 'weight-loss-with-professionals', 'Have you ever wanted to start working out but quit because of several reasons below?\nI don’t have time because of my busy schedule.\nThere is no gym around where I live\nI don’t know how to start working out and hiring a personal trainer is expensive\nI don’t want to start working out alone\nI just want to work out at home during my free time.\nWhat if I tell you now your problems are all solved with our 100-Days Diet Program?\nThis program is designed to provide the best value a person can get when they go to the gym and start exercising.\nThen, what are the values of this program?\n\nYou can learn stretching for your whole body that you must do to prevent injury before exercising\n\nYou will be learning the exercises explained by a highly experienced personal trainer.\nThis program offers you a variety of exercise routines for the next 100 days.\nNew exercises will be added every two weeks in order to prevent it from being boring.\n\nPeople’s bodies will adjust to the same amount of exercise intensity, however, our program will provide different routines that increase the intensity of the exercise.\n\nWorking out alone can be very boring and demotivating, however, the working out videos of this program even offers you a workout partner so you can just watch and work out with your workout partner.\n\nEven, there are well-organized nutrition guides and diet tips that can maximize the effectiveness of the exercises you will have done.', 49, 199, 0, '172', '4h 20m', 'https://res.cloudinary.com/dev-empty/image/upload/v1715673707/kwhmjslaejhompfb6dod.jpg', 'Three_Months', '', 'Fitness beginner\nThose who want to lose fat\nThose who want to build muscle\nThose who are interested in fitness', '', 1, 0, 0, '2024-05-14 08:03:01.487', '2024-05-14 08:03:56.172'),
(5, 8, 5, 'The Ultimate 6-Week Fat Loss Program', 'the-ultimate-6-week-fat-loss-program', 'Six Week Shred is a 42-day fitness course, meticulously crafted to burn fat and build muscle – without giving up the foods we love. It’s not just another exercise program, however. This self-funded course is composed of comprehensive lessons about diet, exercise, and day-by-day routines. While the intense workouts and studied dieting techniques are challenging, it’s designed for all skill levels. The only requirement is the determination and commitment to change your life. If you complete Six Week Shred, you’ll be rewarded with a physique beyond your imagination and a mastery of diet and exercise. Look and feel better than ever by starting Six Week Shred, today.\n\nNot sold? This fat loss and muscle-building program was initially created for Instagram and YouTube\'s top influencers. Alex shaped this course to help online stars transform their body.', 49, 149, 0, '156', '5h 35m', 'https://res.cloudinary.com/dev-empty/image/upload/v1715747627/vfo6mgucbmrdajvxyxdo.jpg', 'One_Year', '', 'Males and females with an interest in losing weight between the ages of 18-55.', '', 1, 0, 0, '2024-05-15 04:34:19.786', '2024-05-15 04:38:06.783'),
(6, 8, 6, 'Bodybuilding the Complete Guide', 'bodybuilding-the-complete-guide', 'Are you not sure how to structure a workout plan to build muscle?\n\nAre you not sure how to eat in order to build muscle?\n\nDo you want to know how to build the physique of your dreams?\n\nIf so then keep reading!\n\n95% of people will fail at building the body of their dreams.\n\nTo be successful with bodybuilding you must do something different than everyone else.\n\nYou see, most people only learn about training and nutrition when it comes to bodybuilding.\n\nThat\'s great, but it\'s not the complete picture!\n\nYou need a complete program that involves Training, Nutrition, Sleep, and Mindset advice.\n\nMost bodybuilding plans will leave you hanging with only 2 of these 4 key areas!\n\nThat\'s why it\'s inevitable for most people to fail!\n\nNot only that, but who\'s to say that the current nutrition and training advice you\'ve been hearing is even good?\n\nInstead what you need is the right information explained in a way that\'s easy to understand so that all you have to worry about is execution.\n\nYou don\'t want to spend all day at the gym.\n\nYou don\'t want to be a slave to the kitchen.\n\nYou want to fit and have a life outside of fitness\n\nWith this bodybuilding course, I\'m going to show you exactly how you can build the body of your dreams without having to dedicate your entire life to fitness.\n\nThis means that you\'re going to build the body of your dreams in an easy and sustainable manner.\n\nI\'m sure this sounds great and all, but who I am to be teaching you about this anyway?', 99, 199, 0, '44', '3h 25m', 'https://res.cloudinary.com/dev-empty/image/upload/v1715747807/c9gekaakptdnwfvytntx.jpg', 'Lifetime', '', 'My name is Thomas Rohmer and I have a Kinesiology degree from the University of North Texas, experience working as a personal trainer, and I\'ve self-published 13 different health and fitness books.\n\nOver the years, I\'ve seen a lot of the things that people commonly struggle with when it comes to reaching their health and fitness goals. That\'s why I always make sure to craft my advice and programs in a way that thinks of potential problems in advance and then solves them.\n\nI don\'t care about what should work on paper, I care about what actually works for real people who have normal jobs.\n\nI love sharing my unique knowledge with others who are eager to learn and get started. I hope to inspire you to take action and achieve your health goals!', '', 1, 0, 0, '2024-05-15 04:37:12.609', '2024-05-15 04:38:07.815');

-- --------------------------------------------------------

--
-- Table structure for table `Earning`
--

CREATE TABLE `Earning` (
  `id` int(11) NOT NULL,
  `cost` double DEFAULT NULL,
  `userId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `status` enum('Due','Paid','Cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Due',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Enrolment`
--

CREATE TABLE `Enrolment` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `order_number` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int(11) DEFAULT NULL,
  `paymentId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` enum('PENDING','PAID','CANCELLED','HOLD') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `status` enum('PENDING','PAID','CANCELLED','HOLD') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `payment_via` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Enrolment`
--

INSERT INTO `Enrolment` (`id`, `userId`, `courseId`, `order_number`, `price`, `paymentId`, `payment_status`, `status`, `payment_via`, `created_at`) VALUES
(1, 8, 1, 'ORD-7537', 199, 'pi_3PFVIyGkYVWSHYLW1DCncKs1', 'PAID', 'PAID', 'Stripe', '2024-05-12 05:50:40.811');

-- --------------------------------------------------------

--
-- Table structure for table `Favourite`
--

CREATE TABLE `Favourite` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Partner`
--

CREATE TABLE `Partner` (
  `id` int(11) NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE gallery;
CREATE TABLE `Gallery` (
  `id` int(11) NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Gallery` (`id`, `title`, `image`, `created_at`, `updated_at`) VALUES
(2, 'Crossfit', '/images/sala/crossfit.jpeg', '2024-05-13 07:42:45.532', '2024-05-13 07:42:45.532'),
(3, 'MMA1', '/images/sala/MMA1.png', '2024-05-13 07:43:04.854', '2024-05-13 07:43:04.854'),
(4, 'MMA2', '/images/sala/MMA2.png', '2024-05-13 07:43:21.206', '2024-05-13 07:43:21.206'),
(5, 'Pesistica 1', '/images/sala/pesistica1.jpeg', '2024-05-13 07:44:00.967', '2024-05-13 07:44:00.967'),
(6, 'Pesistica 2', '/images/sala/pesistica2.jpeg', '2024-05-13 07:44:25.895', '2024-05-13 07:44:25.895'),
(7, 'Pugilato', '/images/sala/pugilato.jpeg', '2024-05-13 07:44:44.452', '2024-05-13 07:44:44.452'),
(8, 'Relax', '/images/sala/relax.jpeg', '2024-05-13 07:44:44.452', '2024-05-13 07:44:44.452'),
(9, 'Palestra 1', '/images/sala/sala-1.jpg', '2024-05-13 07:44:44.452', '2024-05-13 07:44:44.452'),
(10, 'Ring', '/images/sala/ring.jpeg', '2024-05-13 07:44:44.452', '2024-05-13 07:44:44.452'),
(11, 'Palestra 2', '/images/sala/sala-2.jpg', '2024-05-13 07:44:44.452', '2024-05-13 07:44:44.452');





--
-- Dumping data for table `Partner`
--

INSERT INTO `Partner` (`id`, `name`, `image`, `created_at`, `updated_at`) VALUES
(2, 'Apple', 'https://res.cloudinary.com/dev-empty/image/upload/v1715586162/pm1xrjqmr12vgpaazas1.png', '2024-05-13 07:42:45.532', '2024-05-13 07:42:45.532'),
(3, 'John Doe', 'https://res.cloudinary.com/dev-empty/image/upload/v1715586182/ukneflkpctovwajifmtu.png', '2024-05-13 07:43:04.854', '2024-05-13 07:43:04.854'),
(4, 'Matd Villa', 'https://res.cloudinary.com/dev-empty/image/upload/v1715586195/axbiasjwiasf7oddgfx7.png', '2024-05-13 07:43:21.206', '2024-05-13 07:43:21.206'),
(5, 'New Project', 'https://res.cloudinary.com/dev-empty/image/upload/v1715586239/zkl2boje4v5xa8otbzo8.png', '2024-05-13 07:44:00.967', '2024-05-13 07:44:00.967'),
(6, 'Apple', 'https://res.cloudinary.com/dev-empty/image/upload/v1715586264/amisjgouoc2vgniw9ono.png', '2024-05-13 07:44:25.895', '2024-05-13 07:44:25.895'),
(7, 'MS Office', 'https://res.cloudinary.com/dev-empty/image/upload/v1715586282/lk2zuikhtcxcftgfhvux.png', '2024-05-13 07:44:44.452', '2024-05-13 07:44:44.452');

-- --------------------------------------------------------

--
-- Table structure for table `Profile`
--

CREATE TABLE `Profile` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `twitter` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facebook` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linkedin` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `youtube` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Profile`
--

INSERT INTO `Profile` (`id`, `userId`, `bio`, `location`, `phone`, `website`, `twitter`, `facebook`, `linkedin`, `youtube`) VALUES
(1, 8, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 'Bangladesh', '+8801646295918', 'https://www.booking.com/', 'https://twitter.com', 'https://facebook.com', 'https://linkedin.com', 'https://youtube.com');

-- --------------------------------------------------------

--
-- Table structure for table `Progress`
--

CREATE TABLE `Progress` (
  `id` int(11) NOT NULL,
  `finished` tinyint(1) NOT NULL DEFAULT '1',
  `userId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `videoId` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Progress`
--

INSERT INTO `Progress` (`id`, `finished`, `userId`, `courseId`, `videoId`, `created_at`) VALUES
(3, 1, 8, 1, 3, '2024-05-12 07:20:48.833'),
(4, 1, 8, 1, 4, '2024-05-12 07:21:00.632');

-- --------------------------------------------------------

--
-- Table structure for table `Review`
--

CREATE TABLE `Review` (
  `id` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `userId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Review`
--

INSERT INTO `Review` (`id`, `rating`, `comment`, `userId`, `courseId`, `created_at`, `updated_at`) VALUES
(1, 4, 'Nice course...', 8, 2, '2024-05-09 06:22:54.166', '2024-05-09 06:22:54.166'),
(2, 2, 'Very Poor....', 8, 2, '2024-05-09 06:23:05.943', '2024-05-09 06:23:05.943'),
(3, 3, 'Terrible...', 8, 2, '2024-05-09 06:23:17.832', '2024-05-09 06:23:17.832'),
(4, 5, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra elementum tellus odio at enim arcu eget tristique sed. Tellus tellus ac orci id est faucibus mattis ultrices gravida.', 8, 2, '2024-05-09 06:23:24.990', '2024-05-09 06:23:24.990'),
(5, 3, 'Av...', 8, 2, '2024-05-09 06:42:16.357', '2024-05-09 06:42:16.357');

-- --------------------------------------------------------

--
-- Table structure for table `Subscription`
--

CREATE TABLE `Subscription` (
  `id` int(11) NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Testimonial`
--

CREATE TABLE `Testimonial` (
  `id` int(11) NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



--
-- Dumping data for table `Testimonial`
--

INSERT INTO `Testimonial` (`id`, `name`, `image`, `designation`, `description`, `created_at`, `updated_at`) VALUES
(2, 'John Doe', 'https://res.cloudinary.com/dev-empty/image/upload/v1715589371/lzmhin0kvlmotbv8s6bt.png', 'Angular CEO', 'Many stations repurpose their content in podcast episodes. Offering a platform to listen to a down leas these podcast’s can help reach a broader audience. Links to the station social media profiles allow users to connect and interact in this business website design.', '2024-05-13 08:36:52.591', '2024-05-13 08:44:21.088'),
(3, 'Steve Wokes', 'https://res.cloudinary.com/dev-empty/image/upload/v1715589431/lthwtcpbh56hhgqpnj5m.png', 'React Developer', 'Many stations repurpose their content in podcast episodes. Offering a platform to listen to a down leas these podcast’s can help reach a broader audience. Links to the station social media profiles allow users to connect and interact in this business website design.', '2024-05-13 08:37:26.670', '2024-05-13 08:37:26.670'),
(4, 'Json S.', 'https://res.cloudinary.com/dev-empty/image/upload/v1715589456/x9yhb3fhyrcmpsewtbqz.png', 'CEO At ImportDesk', 'Many stations repurpose their content in podcast episodes. Offering a platform to listen to a down leas these podcast’s can help reach a broader audience. Links to the station social media profiles allow users to connect and interact in this business website design.', '2024-05-13 08:37:53.609', '2024-05-13 08:37:53.609'),
(5, 'Wiliam M.', 'https://res.cloudinary.com/dev-empty/image/upload/v1715589526/nmqyd1bjj506tf4e91tm.png', 'Student', 'Many stations repurpose their content in podcast episodes. Offering a platform to listen to a down leas these podcast’s can help reach a broader audience. Links to the station social media profiles allow users to connect and interact in this business website design.', '2024-05-13 08:39:03.935', '2024-05-13 08:39:03.935');


-- --------------------------------------------------------

--
-- Table structure for table `Instructor`
--

-- --------------------------------------------------------

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `id` int(11) NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hashedPassword` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('USER','ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER',
  `gender` enum('Male','Female') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_moderator` tinyint(1) NOT NULL DEFAULT '0',
  `email_confirmed` tinyint(1) NOT NULL DEFAULT '0',
  `email_confirmed_at` datetime(3) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `User`
--
DROP TABLE `User`;


INSERT INTO `User` (`id`, `name`, `email`, `hashedPassword`, `image`, `designation`, `role`, `gender`, `is_moderator`, `email_confirmed`, `email_confirmed_at`, `is_active`, `created_at`, `updated_at`) VALUES
(8, 'John', 'john@gmail.com', '$2b$12$/cQ4sIzKjZu9amoyHwo44uYkKZXFSKCdJDfUCMjKUjSQ3vsAlEFVm', 'https://res.cloudinary.com/dev-empty/image/upload/v1714980983/vhp4ku4ne9bf8jwfjxsr.jpg', 'React Developer', 'ADMIN', 'Male', 0, 0, NULL, 1, '2024-05-05 17:20:38.286', '2024-05-14 07:02:59.387');

-- --------------------------------------------------------

--
-- Table structure for table `Video`
--

CREATE TABLE `Video` (
  `id` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `group_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumb_Image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `video_url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `video_length` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_preview` tinyint(1) NOT NULL DEFAULT '0',
  `short_id` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Video`
--

INSERT INTO `Video` (`id`, `courseId`, `group_name`, `title`, `thumb_Image`, `video_url`, `video_length`, `is_preview`, `short_id`, `created_at`, `updated_at`) VALUES
(2, 2, 'Introduction', 'Project start', 'https://res.cloudinary.com/dev-empty/image/upload/v1715146949/to3epcrtbp3qflnukmpr.jpg', 'https://res.cloudinary.com/dev-empty/video/upload/v1715146932/zjy5fir1filg42o0babu.mp4', '00:00:10', 1, 1, '2024-05-08 05:42:35.166', '2024-05-08 05:42:35.166'),
(3, 1, 'Introduction', 'Setup Environment', 'https://res.cloudinary.com/dev-empty/image/upload/v1715496833/yhmhagoinfcycbyr8uch.jpg', 'https://res.cloudinary.com/dev-empty/video/upload/v1715496846/oavh7xeuyok533ksadw8.mp4', '00:00:10', 1, 1, '2024-05-12 06:54:15.640', '2024-05-12 06:54:15.640'),
(4, 1, 'Introduction', 'Start project', 'https://res.cloudinary.com/dev-empty/image/upload/v1715496900/pkzflvcfrksp2eluny9c.jpg', 'https://res.cloudinary.com/dev-empty/video/upload/v1715496880/gpch8xwfwe7ekhqloxjk.mp4', '00:00:20', 0, 2, '2024-05-12 06:55:04.606', '2024-05-12 06:55:04.606'),
(7, 3, 'Introduction', 'Day 1', 'https://res.cloudinary.com/dev-empty/image/upload/v1715673508/nd754be7ydqmk9lix05a.jpg', 'https://res.cloudinary.com/dev-empty/video/upload/v1715673520/z3fa66ur0rpuxvow9i03.mp4', '00:00:10', 0, 1, '2024-05-14 07:58:47.142', '2024-05-14 07:58:47.142'),
(8, 3, 'Introduction', 'Day 2', 'https://res.cloudinary.com/dev-empty/image/upload/v1715673559/oqh7ny03rujylla17yh4.jpg', 'https://res.cloudinary.com/dev-empty/video/upload/v1715673542/ntepxxeyiqx7e5sz0muy.mp4', '00:00:20', 0, 2, '2024-05-14 07:59:24.026', '2024-05-14 07:59:24.026'),
(9, 4, 'Introduction', 'Weight Loss Day 1', 'https://res.cloudinary.com/dev-empty/image/upload/v1715673808/psetdkpuiiotytbbwlrk.jpg', 'https://res.cloudinary.com/dev-empty/video/upload/v1715673821/e9nicromennpauqjx9y3.mp4', '00:00:19', 0, 1, '2024-05-14 08:03:46.947', '2024-05-14 08:03:46.947'),
(10, 5, 'Introduction', 'Day 1', 'https://res.cloudinary.com/dev-empty/image/upload/v1715747681/pewmfkyah3cibo7ptdho.jpg', 'https://res.cloudinary.com/dev-empty/video/upload/v1715747699/lz5xxepj9lid28dqzzye.mp4', '00:00:19', 0, 1, '2024-05-15 04:35:05.029', '2024-05-15 04:35:05.029'),
(11, 6, 'Introduction', 'Day 1', 'https://res.cloudinary.com/dev-empty/image/upload/v1715747851/x13afswnhnlxz6b7ztld.jpg', 'https://res.cloudinary.com/dev-empty/video/upload/v1715747868/hbkzyozz0q4cvfec0t0v.mp4', '00:00:20', 0, 1, '2024-05-15 04:37:54.354', '2024-05-15 04:37:54.354');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Account`
--
ALTER TABLE `Account`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Account_provider_providerAccountId_key` (`provider`,`providerAccountId`),
  ADD KEY `Account_userId_idx` (`userId`);

--
-- Indexes for table `Asset`
--
ALTER TABLE `Asset`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Asset_courseId_idx` (`courseId`);

--
-- Indexes for table `Category`
--
ALTER TABLE `Category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Category_slug_key` (`slug`);

--
-- Indexes for table `Coupon`
--
ALTER TABLE `Coupon`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Coupon_code_key` (`code`);

--
-- Indexes for table `Course`
--
ALTER TABLE `Course`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Course_slug_key` (`slug`),
  ADD KEY `Course_userId_catId_idx` (`userId`,`catId`);

  
ALTER TABLE `Event`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Earning`
--
ALTER TABLE `Earning`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Earning_courseId_userId_idx` (`courseId`,`userId`);

--
-- Indexes for table `Enrolment`
--
ALTER TABLE `Enrolment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Enrolment_order_number_key` (`order_number`),
  ADD KEY `Enrolment_courseId_userId_idx` (`courseId`,`userId`);

--
-- Indexes for table `Favourite`
--
ALTER TABLE `Favourite`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Favourite_courseId_userId_idx` (`courseId`,`userId`);

--
-- Indexes for table `Partner`
--
ALTER TABLE `Partner`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Gallery`
--
ALTER TABLE `Gallery`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Profile`
--
ALTER TABLE `Profile`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Profile_userId_key` (`userId`);

--
-- Indexes for table `Progress`
--
ALTER TABLE `Progress`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Progress_courseId_userId_videoId_idx` (`courseId`,`userId`,`videoId`);

--
-- Indexes for table `Review`
--
ALTER TABLE `Review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Review_userId_courseId_idx` (`userId`,`courseId`);

--
-- Indexes for table `Subscription`
--
ALTER TABLE `Subscription`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Subscription_email_key` (`email`);

--
-- Indexes for table `Testimonial`
--
ALTER TABLE `Testimonial`
  ADD PRIMARY KEY (`id`);

  --
-- Indexes for table `Announcement`
--
ALTER TABLE `Announcement`
  ADD PRIMARY KEY (`id`);

  --
-- Indexes for table `Instructor`
--
ALTER TABLE `Instructor`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indexes for table `Video`
--
ALTER TABLE `Video`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Video_courseId_idx` (`courseId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Account`
--
ALTER TABLE `Account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Asset`
--
ALTER TABLE `Asset`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `Category`
--
ALTER TABLE `Category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `Coupon`
--
ALTER TABLE `Coupon`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Course`
--
ALTER TABLE `Course`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

  ALTER TABLE `Event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `Earning`
--
ALTER TABLE `Earning`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Enrolment`
--
ALTER TABLE `Enrolment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Favourite`
--
ALTER TABLE `Favourite`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `Partner`
--
ALTER TABLE `Partner`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

  --
-- AUTO_INCREMENT for table `Gallery`
--
ALTER TABLE `Gallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `Profile`
--
ALTER TABLE `Profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Progress`
--
ALTER TABLE `Progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Review`
--
ALTER TABLE `Review`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `Subscription`
--
ALTER TABLE `Subscription`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Testimonial`
--
ALTER TABLE `Testimonial`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

  --
-- AUTO_INCREMENT for table `Instructor`
--
ALTER TABLE `Instructor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `Video`
--
ALTER TABLE `Video`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
