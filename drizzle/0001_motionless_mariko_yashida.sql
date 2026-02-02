CREATE TABLE `notification_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`processId` varchar(64),
	`numeroProcesso` varchar(64),
	`tipo` enum('vencido','urgente','proximo') NOT NULL,
	`assunto` varchar(255) NOT NULL,
	`status` enum('enviado','falha','pendente') NOT NULL DEFAULT 'pendente',
	`dataPrazo` timestamp,
	`dataEnvio` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notification_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notification_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`emailNotificationsEnabled` enum('true','false') NOT NULL DEFAULT 'true',
	`notifyVencidos` enum('true','false') NOT NULL DEFAULT 'true',
	`notifyUrgentes` enum('true','false') NOT NULL DEFAULT 'true',
	`notifyProximos` enum('true','false') NOT NULL DEFAULT 'true',
	`diasAntecedencia` int NOT NULL DEFAULT 7,
	`horarioNotificacao` varchar(5) NOT NULL DEFAULT '09:00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notification_preferences_id` PRIMARY KEY(`id`)
);
