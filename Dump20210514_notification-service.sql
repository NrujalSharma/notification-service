CREATE DATABASE  IF NOT EXISTS `notification_service` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `notification_service`;
-- MySQL dump 10.13  Distrib 8.0.20, for Win64 (x86_64)
--
-- Host: localhost    Database: notification_service
-- ------------------------------------------------------
-- Server version	8.0.24

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary view structure for view `SCHEDULED_FAILED_NOTIFICATIONS`
--

DROP TABLE IF EXISTS `SCHEDULED_FAILED_NOTIFICATIONS`;
/*!50001 DROP VIEW IF EXISTS `SCHEDULED_FAILED_NOTIFICATIONS`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `SCHEDULED_FAILED_NOTIFICATIONS` AS SELECT 
 1 AS `failedNotificationId`,
 1 AS `retryCount`,
 1 AS `notificationId`,
 1 AS `title`,
 1 AS `template`,
 1 AS `category`,
 1 AS `medium`,
 1 AS `type`,
 1 AS `frequency`,
 1 AS `status`,
 1 AS `userId`,
 1 AS `createdBy`,
 1 AS `sendAt`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `SCHEDULED_NOTIFICATIONS`
--

DROP TABLE IF EXISTS `SCHEDULED_NOTIFICATIONS`;
/*!50001 DROP VIEW IF EXISTS `SCHEDULED_NOTIFICATIONS`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `SCHEDULED_NOTIFICATIONS` AS SELECT 
 1 AS `notificationId`,
 1 AS `title`,
 1 AS `template`,
 1 AS `category`,
 1 AS `medium`,
 1 AS `type`,
 1 AS `frequency`,
 1 AS `userId`,
 1 AS `createdBy`,
 1 AS `sendAt`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(45) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `failed_notifications`
--

DROP TABLE IF EXISTS `failed_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_notifications` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `notificationId` int unsigned NOT NULL,
  `userId` int unsigned DEFAULT NULL,
  `retryCount` tinyint DEFAULT '0',
  `status` enum('pending','success','failed') DEFAULT 'pending',
  `error` mediumtext,
  `sendAt` datetime NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `failedNotificationUserFK_idx` (`userId`),
  KEY `failedNotificationToNotificationFK_idx` (`notificationId`),
  CONSTRAINT `FailedNotificationToNotificationFK` FOREIGN KEY (`notificationId`) REFERENCES `notifications` (`id`),
  CONSTRAINT `FailedNotificationToUserFK` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notification_categories`
--

DROP TABLE IF EXISTS `notification_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `canUnsubscribe` tinyint DEFAULT '0',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `type_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notification_mediums`
--

DROP TABLE IF EXISTS `notification_mediums`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_mediums` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `medium_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` tinytext NOT NULL,
  `template` mediumtext NOT NULL,
  `category` int unsigned NOT NULL,
  `medium` int unsigned NOT NULL,
  `userId` int unsigned DEFAULT NULL,
  `type` enum('ad-hoc','pre-scheduled') NOT NULL,
  `frequency` enum('daily','monthly') DEFAULT NULL,
  `createdBy` int unsigned NOT NULL,
  `sendAt` datetime NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `userFK_idx` (`userId`),
  KEY `notificationTypeFK_idx` (`category`),
  KEY `adminFK_idx` (`createdBy`),
  KEY `notificationMediumFK_idx` (`medium`),
  CONSTRAINT `NotificationToAdminFK` FOREIGN KEY (`createdBy`) REFERENCES `admins` (`id`),
  CONSTRAINT `NotificationToNotificationMediumFK` FOREIGN KEY (`medium`) REFERENCES `notification_mediums` (`id`),
  CONSTRAINT `NotificationToNotificationTypeFK` FOREIGN KEY (`category`) REFERENCES `notification_categories` (`id`),
  CONSTRAINT `NotificationToUserFK` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=317 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `phone_no` varchar(32) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `phone_no_UNIQUE` (`phone_no`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'notification_service'
--

--
-- Dumping routines for database 'notification_service'
--

--
-- Final view structure for view `SCHEDULED_FAILED_NOTIFICATIONS`
--

/*!50001 DROP VIEW IF EXISTS `SCHEDULED_FAILED_NOTIFICATIONS`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `SCHEDULED_FAILED_NOTIFICATIONS` AS select `fn`.`id` AS `failedNotificationId`,`fn`.`retryCount` AS `retryCount`,`n`.`id` AS `notificationId`,`n`.`title` AS `title`,`n`.`template` AS `template`,`nc`.`name` AS `category`,`nm`.`name` AS `medium`,`n`.`type` AS `type`,`n`.`frequency` AS `frequency`,`fn`.`status` AS `status`,`u`.`id` AS `userId`,`a`.`id` AS `createdBy`,`fn`.`sendAt` AS `sendAt` from (((((`failed_notifications` `fn` join `notifications` `n` on((`fn`.`notificationId` = `n`.`id`))) join `notification_categories` `nc` on((`n`.`category` = `nc`.`id`))) join `notification_mediums` `nm` on((`n`.`medium` = `nm`.`id`))) join `admins` `a` on((`n`.`createdBy` = `a`.`id`))) left join `users` `u` on((`fn`.`userId` = `u`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `SCHEDULED_NOTIFICATIONS`
--

/*!50001 DROP VIEW IF EXISTS `SCHEDULED_NOTIFICATIONS`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `SCHEDULED_NOTIFICATIONS` AS select `n`.`id` AS `notificationId`,`n`.`title` AS `title`,`n`.`template` AS `template`,`nc`.`name` AS `category`,`nm`.`name` AS `medium`,`n`.`type` AS `type`,`n`.`frequency` AS `frequency`,`u`.`id` AS `userId`,`a`.`id` AS `createdBy`,`n`.`sendAt` AS `sendAt` from ((((`notifications` `n` join `notification_categories` `nc` on((`n`.`category` = `nc`.`id`))) join `notification_mediums` `nm` on((`n`.`medium` = `nm`.`id`))) join `admins` `a` on((`n`.`createdBy` = `a`.`id`))) left join `users` `u` on((`n`.`userId` = `u`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-14  7:48:04
