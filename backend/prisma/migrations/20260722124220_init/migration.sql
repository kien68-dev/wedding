BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(1000) NOT NULL,
    [passwordHash] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL CONSTRAINT [User_role_df] DEFAULT 'STAFF',
    [isActive] BIT NOT NULL CONSTRAINT [User_isActive_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Customer] (
    [id] INT NOT NULL IDENTITY(1,1),
    [fullName] NVARCHAR(1000) NOT NULL,
    [phone] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000),
    [citizenId] NVARCHAR(1000),
    [address] NVARCHAR(1000),
    [notes] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Customer_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Customer_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Couple] (
    [id] INT NOT NULL IDENTITY(1,1),
    [brideName] NVARCHAR(1000) NOT NULL,
    [groomName] NVARCHAR(1000) NOT NULL,
    [birthDate] DATETIME2,
    [profession] NVARCHAR(1000),
    [photoUrl] NVARCHAR(1000),
    [facebook] NVARCHAR(1000),
    [notes] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Couple_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Couple_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Venue] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [capacity] INT NOT NULL,
    [price] FLOAT(53) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Venue_status_df] DEFAULT 'AVAILABLE',
    [imageUrl] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Venue_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Venue_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[TableSetting] (
    [id] INT NOT NULL IDENTITY(1,1),
    [tableNumber] INT NOT NULL,
    [capacity] INT NOT NULL,
    [price] FLOAT(53) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [TableSetting_status_df] DEFAULT 'AVAILABLE',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [TableSetting_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [TableSetting_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Menu] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appetizer] NVARCHAR(1000),
    [mainCourse] NVARCHAR(1000),
    [dessert] NVARCHAR(1000),
    [beverage] NVARCHAR(1000),
    [imageUrl] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Menu_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Menu_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Service] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [price] FLOAT(53),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Service_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Service_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[WeddingEvent] (
    [id] INT NOT NULL IDENTITY(1,1),
    [eventDate] DATETIME2 NOT NULL,
    [eventTime] NVARCHAR(1000) NOT NULL,
    [venueId] INT NOT NULL,
    [customerId] INT NOT NULL,
    [menuId] INT,
    [serviceId] INT,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [WeddingEvent_status_df] DEFAULT 'PENDING',
    [totalAmount] FLOAT(53) NOT NULL,
    [depositAmount] FLOAT(53),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [WeddingEvent_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [WeddingEvent_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Contract] (
    [id] INT NOT NULL IDENTITY(1,1),
    [customerId] INT NOT NULL,
    [totalValue] FLOAT(53) NOT NULL,
    [depositAmount] FLOAT(53) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Contract_status_df] DEFAULT 'PENDING',
    [pdfUrl] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Contract_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Contract_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Payment] (
    [id] INT NOT NULL IDENTITY(1,1),
    [eventId] INT NOT NULL,
    [amount] FLOAT(53) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Payment_status_df] DEFAULT 'PENDING',
    [transactionDate] DATETIME2 NOT NULL CONSTRAINT [Payment_transactionDate_df] DEFAULT CURRENT_TIMESTAMP,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Payment_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Payment_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Guest] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [phone] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [tableNumber] INT,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Guest_status_df] DEFAULT 'PENDING',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Guest_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [weddingEventId] INT,
    CONSTRAINT [Guest_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[WeddingEvent] ADD CONSTRAINT [WeddingEvent_venueId_fkey] FOREIGN KEY ([venueId]) REFERENCES [dbo].[Venue]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[WeddingEvent] ADD CONSTRAINT [WeddingEvent_customerId_fkey] FOREIGN KEY ([customerId]) REFERENCES [dbo].[Customer]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[WeddingEvent] ADD CONSTRAINT [WeddingEvent_menuId_fkey] FOREIGN KEY ([menuId]) REFERENCES [dbo].[Menu]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[WeddingEvent] ADD CONSTRAINT [WeddingEvent_serviceId_fkey] FOREIGN KEY ([serviceId]) REFERENCES [dbo].[Service]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Contract] ADD CONSTRAINT [Contract_customerId_fkey] FOREIGN KEY ([customerId]) REFERENCES [dbo].[Customer]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Payment] ADD CONSTRAINT [Payment_eventId_fkey] FOREIGN KEY ([eventId]) REFERENCES [dbo].[WeddingEvent]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Guest] ADD CONSTRAINT [Guest_weddingEventId_fkey] FOREIGN KEY ([weddingEventId]) REFERENCES [dbo].[WeddingEvent]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
