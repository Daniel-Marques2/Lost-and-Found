CREATE TABLE `lost_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`authorId` int NOT NULL,
	`title` varchar(160) NOT NULL,
	`description` text NOT NULL,
	`category` varchar(48) NOT NULL,
	`kind` enum('lost','found') NOT NULL,
	`building` varchar(64) NOT NULL,
	`floor` varchar(32) NOT NULL,
	`room` varchar(32) NOT NULL,
	`occurredAt` timestamp NOT NULL,
	`status` enum('open','returned') NOT NULL DEFAULT 'open',
	`images` text,
	`contactNote` varchar(240),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lost_items_id` PRIMARY KEY(`id`)
);
