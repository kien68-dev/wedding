IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'WebWeddingManager')
BEGIN
    CREATE DATABASE [WebWeddingManager];
END;
GO
USE [WebWeddingManager];
GO

IF OBJECT_ID(N'[dbo].[Users]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Users] (
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [Email] NVARCHAR(255) NOT NULL UNIQUE,
        [PasswordHash] NVARCHAR(255) NOT NULL,
        [Name] NVARCHAR(255) NOT NULL,
        [Role] NVARCHAR(50) NOT NULL DEFAULT N'STAFF',
        [IsActive] BIT NOT NULL DEFAULT 1,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
        [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END;
GO

IF OBJECT_ID(N'[dbo].[Customers]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Customers] (
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [FullName] NVARCHAR(255) NOT NULL,
        [Phone] NVARCHAR(50) NOT NULL,
        [Email] NVARCHAR(255) NULL,
        [CitizenId] NVARCHAR(50) NULL,
        [Address] NVARCHAR(500) NULL,
        [Notes] NVARCHAR(MAX) NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
        [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END;
GO

IF OBJECT_ID(N'[dbo].[Couples]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Couples] (
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [BrideName] NVARCHAR(255) NOT NULL,
        [GroomName] NVARCHAR(255) NOT NULL,
        [BirthDate] DATETIME2 NULL,
        [Profession] NVARCHAR(255) NULL,
        [PhotoUrl] NVARCHAR(500) NULL,
        [Facebook] NVARCHAR(500) NULL,
        [Notes] NVARCHAR(MAX) NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
        [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END;
GO

IF OBJECT_ID(N'[dbo].[Venues]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Venues] (
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [Name] NVARCHAR(255) NOT NULL,
        [Capacity] INT NOT NULL,
        [Price] DECIMAL(12,2) NOT NULL,
        [Status] NVARCHAR(50) NOT NULL DEFAULT N'AVAILABLE',
        [ImageUrl] NVARCHAR(500) NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
        [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END;
GO

IF OBJECT_ID(N'[dbo].[TableSettings]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[TableSettings] (
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [TableNumber] INT NOT NULL,
        [Capacity] INT NOT NULL,
        [Price] DECIMAL(12,2) NOT NULL,
        [Status] NVARCHAR(50) NOT NULL DEFAULT N'AVAILABLE',
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
        [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END;
GO

IF OBJECT_ID(N'[dbo].[Menus]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Menus] (
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [Appetizer] NVARCHAR(255) NULL,
        [MainCourse] NVARCHAR(255) NULL,
        [Dessert] NVARCHAR(255) NULL,
        [Beverage] NVARCHAR(255) NULL,
        [ImageUrl] NVARCHAR(500) NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
        [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END;
GO

IF OBJECT_ID(N'[dbo].[Services]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Services] (
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [Name] NVARCHAR(255) NOT NULL,
        [Description] NVARCHAR(MAX) NULL,
        [Price] DECIMAL(12,2) NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
        [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END;
GO

IF OBJECT_ID(N'[dbo].[WeddingEvents]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[WeddingEvents] (
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [EventDate] DATETIME2 NOT NULL,
        [EventTime] NVARCHAR(50) NOT NULL,
        [VenueId] INT NOT NULL,
        [CustomerId] INT NOT NULL,
        [MenuId] INT NULL,
        [ServiceId] INT NULL,
        [Status] NVARCHAR(50) NOT NULL DEFAULT N'PENDING',
        [TotalAmount] DECIMAL(12,2) NOT NULL,
        [DepositAmount] DECIMAL(12,2) NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
        [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END;
GO

IF OBJECT_ID(N'[dbo].[Contracts]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Contracts] (
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [CustomerId] INT NOT NULL,
        [TotalValue] DECIMAL(12,2) NOT NULL,
        [DepositAmount] DECIMAL(12,2) NOT NULL,
        [Status] NVARCHAR(50) NOT NULL DEFAULT N'PENDING',
        [PdfUrl] NVARCHAR(500) NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
        [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END;
GO

IF OBJECT_ID(N'[dbo].[Payments]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Payments] (
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [EventId] INT NOT NULL,
        [Amount] DECIMAL(12,2) NOT NULL,
        [Type] NVARCHAR(50) NOT NULL,
        [Status] NVARCHAR(50) NOT NULL DEFAULT N'PENDING',
        [TransactionDate] DATETIME2 NOT NULL DEFAULT GETDATE(),
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
        [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END;
GO

IF OBJECT_ID(N'[dbo].[Guests]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Guests] (
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [Name] NVARCHAR(255) NOT NULL,
        [Phone] NVARCHAR(50) NULL,
        [Email] NVARCHAR(255) NULL,
        [TableNumber] INT NULL,
        [Status] NVARCHAR(50) NOT NULL DEFAULT N'PENDING',
        [WeddingEventId] INT NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
        [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END;
GO

IF COL_LENGTH(N'dbo.WeddingEvents', N'MenuId') IS NULL
BEGIN
    ALTER TABLE [dbo].[WeddingEvents] ADD [MenuId] INT NULL;
END;
GO

IF COL_LENGTH(N'dbo.WeddingEvents', N'ServiceId') IS NULL
BEGIN
    ALTER TABLE [dbo].[WeddingEvents] ADD [ServiceId] INT NULL;
END;
GO

IF COL_LENGTH(N'dbo.Guests', N'WeddingEventId') IS NULL
BEGIN
    ALTER TABLE [dbo].[Guests] ADD [WeddingEventId] INT NULL;
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_WeddingEvents_Venues')
BEGIN
    ALTER TABLE [dbo].[WeddingEvents]
    WITH CHECK ADD CONSTRAINT [FK_WeddingEvents_Venues] FOREIGN KEY ([VenueId]) REFERENCES [dbo].[Venues] ([Id]);
END;
GO
ALTER TABLE [dbo].[WeddingEvents] CHECK CONSTRAINT [FK_WeddingEvents_Venues];
GO

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_WeddingEvents_Customers')
BEGIN
    ALTER TABLE [dbo].[WeddingEvents]
    WITH CHECK ADD CONSTRAINT [FK_WeddingEvents_Customers] FOREIGN KEY ([CustomerId]) REFERENCES [dbo].[Customers] ([Id]);
END;
GO
ALTER TABLE [dbo].[WeddingEvents] CHECK CONSTRAINT [FK_WeddingEvents_Customers];
GO

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_Contracts_Customers')
BEGIN
    ALTER TABLE [dbo].[Contracts]
    WITH CHECK ADD CONSTRAINT [FK_Contracts_Customers] FOREIGN KEY ([CustomerId]) REFERENCES [dbo].[Customers] ([Id]);
END;
GO
ALTER TABLE [dbo].[Contracts] CHECK CONSTRAINT [FK_Contracts_Customers];
GO

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_Payments_WeddingEvents')
BEGIN
    ALTER TABLE [dbo].[Payments]
    WITH CHECK ADD CONSTRAINT [FK_Payments_WeddingEvents] FOREIGN KEY ([EventId]) REFERENCES [dbo].[WeddingEvents] ([Id]);
END;
GO
ALTER TABLE [dbo].[Payments] CHECK CONSTRAINT [FK_Payments_WeddingEvents];
GO

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_Guests_WeddingEvents')
BEGIN
    ALTER TABLE [dbo].[Guests]
    WITH CHECK ADD CONSTRAINT [FK_Guests_WeddingEvents] FOREIGN KEY ([WeddingEventId]) REFERENCES [dbo].[WeddingEvents] ([Id]);
END;
GO
ALTER TABLE [dbo].[Guests] CHECK CONSTRAINT [FK_Guests_WeddingEvents];
GO

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_WeddingEvents_Menus')
BEGIN
    ALTER TABLE [dbo].[WeddingEvents]
    WITH CHECK ADD CONSTRAINT [FK_WeddingEvents_Menus] FOREIGN KEY ([MenuId]) REFERENCES [dbo].[Menus] ([Id]);
END;
GO
ALTER TABLE [dbo].[WeddingEvents] CHECK CONSTRAINT [FK_WeddingEvents_Menus];
GO

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_WeddingEvents_Services')
BEGIN
    ALTER TABLE [dbo].[WeddingEvents]
    WITH CHECK ADD CONSTRAINT [FK_WeddingEvents_Services] FOREIGN KEY ([ServiceId]) REFERENCES [dbo].[Services] ([Id]);
END;
GO
ALTER TABLE [dbo].[WeddingEvents] CHECK CONSTRAINT [FK_WeddingEvents_Services];
GO

IF NOT EXISTS (SELECT 1 FROM [dbo].[Users] WHERE [Email] = N'admin@wedding.com')
BEGIN
    INSERT INTO [dbo].[Users] ([Email], [PasswordHash], [Name], [Role], [IsActive])
    VALUES (N'admin@wedding.com', N'$2a$10$5fE2dQqXzQ/BE0aEj7P7xe2m5K3M1oP2vgxQw4Xh4x0egWb8p7s0S', N'Administrator', N'ADMIN', 1);
END;
GO

IF NOT EXISTS (SELECT 1 FROM [dbo].[Customers])
BEGIN
    INSERT INTO [dbo].[Customers] ([FullName], [Phone], [Email], [Address], [Notes])
    VALUES 
        (N'Nguyễn Văn A', N'0901111111', N'a@example.com', N'Hà Nội', N'Khách hàng ưu tiên'),
        (N'Trần Thị B', N'0902222222', N'b@example.com', N'Đà Nẵng', N'Yêu cầu trang trí sang trọng');
END;
GO

IF NOT EXISTS (SELECT 1 FROM [dbo].[Venues])
BEGIN
    INSERT INTO [dbo].[Venues] ([Name], [Capacity], [Price], [Status], [ImageUrl])
    VALUES 
        (N'Sảnh Tiêu Vương', 300, 150000000, N'AVAILABLE', N'/images/venue-1.jpg'),
        (N'Sảnh Hoa Cúc', 200, 120000000, N'AVAILABLE', N'/images/venue-2.jpg');
END;
GO

IF NOT EXISTS (SELECT 1 FROM [dbo].[Menus])
BEGIN
    INSERT INTO [dbo].[Menus] ([Appetizer], [MainCourse], [Dessert], [Beverage], [ImageUrl])
    VALUES 
        (N'Gỏi tôm thịt', N'Bò bít tết', N'Panna cotta', N'Nước ép dâu', N'/images/menu-1.jpg'),
        (N'Salad hải sản', N'Gà quay', N'Tiramisu', N'Cocktail hoa quả', N'/images/menu-2.jpg');
END;
GO

IF NOT EXISTS (SELECT 1 FROM [dbo].[Services])
BEGIN
    INSERT INTO [dbo].[Services] ([Name], [Description], [Price])
    VALUES 
        (N'MC', N'Điều phối chương trình', 5000000),
        (N'Ca sĩ', N'Trình diễn trong lễ cưới', 8000000),
        (N'Trang trí', N'Trang trí sảnh và bàn tiệc', 12000000);
END;
GO

IF NOT EXISTS (SELECT 1 FROM [dbo].[WeddingEvents])
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [dbo].[Venues] WHERE [Name] = N'Sảnh Tiêu Vương')
        INSERT INTO [dbo].[Venues] ([Name], [Capacity], [Price], [Status], [ImageUrl]) VALUES (N'Sảnh Tiêu Vương', 300, 150000000, N'AVAILABLE', N'/images/venue-1.jpg');
    IF NOT EXISTS (SELECT 1 FROM [dbo].[Venues] WHERE [Name] = N'Sảnh Hoa Cúc')
        INSERT INTO [dbo].[Venues] ([Name], [Capacity], [Price], [Status], [ImageUrl]) VALUES (N'Sảnh Hoa Cúc', 200, 120000000, N'AVAILABLE', N'/images/venue-2.jpg');
    IF NOT EXISTS (SELECT 1 FROM [dbo].[Customers] WHERE [FullName] = N'Nguyễn Văn A')
        INSERT INTO [dbo].[Customers] ([FullName], [Phone], [Email], [Address], [Notes]) VALUES (N'Nguyễn Văn A', N'0901111111', N'a@example.com', N'Hà Nội', N'Khách hàng ưu tiên');
    IF NOT EXISTS (SELECT 1 FROM [dbo].[Customers] WHERE [FullName] = N'Trần Thị B')
        INSERT INTO [dbo].[Customers] ([FullName], [Phone], [Email], [Address], [Notes]) VALUES (N'Trần Thị B', N'0902222222', N'b@example.com', N'Đà Nẵng', N'Yêu cầu trang trí sang trọng');
    IF NOT EXISTS (SELECT 1 FROM [dbo].[Menus] WHERE [Appetizer] = N'Gỏi tôm thịt')
        INSERT INTO [dbo].[Menus] ([Appetizer], [MainCourse], [Dessert], [Beverage], [ImageUrl]) VALUES (N'Gỏi tôm thịt', N'Bò bít tết', N'Panna cotta', N'Nước ép dâu', N'/images/menu-1.jpg');
    IF NOT EXISTS (SELECT 1 FROM [dbo].[Menus] WHERE [Appetizer] = N'Salad hải sản')
        INSERT INTO [dbo].[Menus] ([Appetizer], [MainCourse], [Dessert], [Beverage], [ImageUrl]) VALUES (N'Salad hải sản', N'Gà quay', N'Tiramisu', N'Cocktail hoa quả', N'/images/menu-2.jpg');
    IF NOT EXISTS (SELECT 1 FROM [dbo].[Services] WHERE [Name] = N'MC')
        INSERT INTO [dbo].[Services] ([Name], [Description], [Price]) VALUES (N'MC', N'Điều phối chương trình', 5000000);
    IF NOT EXISTS (SELECT 1 FROM [dbo].[Services] WHERE [Name] = N'Ca sĩ')
        INSERT INTO [dbo].[Services] ([Name], [Description], [Price]) VALUES (N'Ca sĩ', N'Trình diễn trong lễ cưới', 8000000);

    DECLARE @Venue1 INT = (SELECT TOP 1 [Id] FROM [dbo].[Venues] WHERE [Name] = N'Sảnh Tiêu Vương');
    DECLARE @Venue2 INT = (SELECT TOP 1 [Id] FROM [dbo].[Venues] WHERE [Name] = N'Sảnh Hoa Cúc');
    DECLARE @Customer1 INT = (SELECT TOP 1 [Id] FROM [dbo].[Customers] WHERE [FullName] = N'Nguyễn Văn A');
    DECLARE @Customer2 INT = (SELECT TOP 1 [Id] FROM [dbo].[Customers] WHERE [FullName] = N'Trần Thị B');
    DECLARE @Menu1 INT = (SELECT TOP 1 [Id] FROM [dbo].[Menus] WHERE [Appetizer] = N'Gỏi tôm thịt');
    DECLARE @Menu2 INT = (SELECT TOP 1 [Id] FROM [dbo].[Menus] WHERE [Appetizer] = N'Salad hải sản');
    DECLARE @Service1 INT = (SELECT TOP 1 [Id] FROM [dbo].[Services] WHERE [Name] = N'MC');
    DECLARE @Service2 INT = (SELECT TOP 1 [Id] FROM [dbo].[Services] WHERE [Name] = N'Ca sĩ');

    INSERT INTO [dbo].[WeddingEvents] ([EventDate], [EventTime], [VenueId], [CustomerId], [MenuId], [ServiceId], [Status], [TotalAmount], [DepositAmount])
    VALUES 
        (N'2026-12-10T18:00:00', N'18:00', @Venue1, @Customer1, @Menu1, @Service1, N'PENDING', 250000000, 50000000),
        (N'2026-11-20T19:00:00', N'19:00', @Venue2, @Customer2, @Menu2, @Service2, N'CONFIRMED', 220000000, 45000000);
END;
GO

IF NOT EXISTS (SELECT 1 FROM [dbo].[Guests])
BEGIN
    DECLARE @Event1 INT = (SELECT TOP 1 [Id] FROM [dbo].[WeddingEvents] WHERE [EventTime] = N'18:00');
    DECLARE @Event2 INT = (SELECT TOP 1 [Id] FROM [dbo].[WeddingEvents] WHERE [EventTime] = N'19:00');

    INSERT INTO [dbo].[Guests] ([Name], [Phone], [Email], [TableNumber], [Status], [WeddingEventId])
    VALUES 
        (N'Phạm Minh Tuấn', N'0912345678', N'tuan@example.com', 1, N'PENDING', @Event1),
        (N'Lê Thị Hương', N'0987654321', N'huong@example.com', 2, N'ATTENDED', @Event1),
        (N'Đặng Quốc An', N'0933333333', N'an@example.com', 3, N'PENDING', @Event2);
END;
GO

IF NOT EXISTS (SELECT 1 FROM [dbo].[Contracts])
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [dbo].[Customers] WHERE [FullName] = N'Nguyễn Văn A')
        INSERT INTO [dbo].[Customers] ([FullName], [Phone], [Email], [Address], [Notes]) VALUES (N'Nguyễn Văn A', N'0901111111', N'a@example.com', N'Hà Nội', N'Khách hàng ưu tiên');
    IF NOT EXISTS (SELECT 1 FROM [dbo].[Customers] WHERE [FullName] = N'Trần Thị B')
        INSERT INTO [dbo].[Customers] ([FullName], [Phone], [Email], [Address], [Notes]) VALUES (N'Trần Thị B', N'0902222222', N'b@example.com', N'Đà Nẵng', N'Yêu cầu trang trí sang trọng');

    DECLARE @Customer1 INT = (SELECT TOP 1 [Id] FROM [dbo].[Customers] WHERE [FullName] = N'Nguyễn Văn A');
    DECLARE @Customer2 INT = (SELECT TOP 1 [Id] FROM [dbo].[Customers] WHERE [FullName] = N'Trần Thị B');

    INSERT INTO [dbo].[Contracts] ([CustomerId], [TotalValue], [DepositAmount], [Status], [PdfUrl])
    VALUES 
        (@Customer1, 250000000, 50000000, N'PENDING', N'/files/contract-1.pdf'),
        (@Customer2, 220000000, 45000000, N'ACTIVE', N'/files/contract-2.pdf');
END;
GO

IF NOT EXISTS (SELECT 1 FROM [dbo].[Payments])
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [dbo].[WeddingEvents] WHERE [EventTime] = N'18:00')
        INSERT INTO [dbo].[WeddingEvents] ([EventDate], [EventTime], [VenueId], [CustomerId], [MenuId], [ServiceId], [Status], [TotalAmount], [DepositAmount])
        SELECT N'2026-12-10T18:00:00', N'18:00', [Id], (SELECT TOP 1 [Id] FROM [dbo].[Customers] WHERE [FullName] = N'Nguyễn Văn A'), (SELECT TOP 1 [Id] FROM [dbo].[Menus] WHERE [Appetizer] = N'Gỏi tôm thịt'), (SELECT TOP 1 [Id] FROM [dbo].[Services] WHERE [Name] = N'MC'), N'PENDING', 250000000, 50000000 FROM [dbo].[Venues] WHERE [Name] = N'Sảnh Tiêu Vương';

    IF NOT EXISTS (SELECT 1 FROM [dbo].[WeddingEvents] WHERE [EventTime] = N'19:00')
        INSERT INTO [dbo].[WeddingEvents] ([EventDate], [EventTime], [VenueId], [CustomerId], [MenuId], [ServiceId], [Status], [TotalAmount], [DepositAmount])
        SELECT N'2026-11-20T19:00:00', N'19:00', [Id], (SELECT TOP 1 [Id] FROM [dbo].[Customers] WHERE [FullName] = N'Trần Thị B'), (SELECT TOP 1 [Id] FROM [dbo].[Menus] WHERE [Appetizer] = N'Salad hải sản'), (SELECT TOP 1 [Id] FROM [dbo].[Services] WHERE [Name] = N'Ca sĩ'), N'CONFIRMED', 220000000, 45000000 FROM [dbo].[Venues] WHERE [Name] = N'Sảnh Hoa Cúc';

    DECLARE @Event1 INT = (SELECT TOP 1 [Id] FROM [dbo].[WeddingEvents] WHERE [EventTime] = N'18:00');
    DECLARE @Event2 INT = (SELECT TOP 1 [Id] FROM [dbo].[WeddingEvents] WHERE [EventTime] = N'19:00');

    INSERT INTO [dbo].[Payments] ([EventId], [Amount], [Type], [Status])
    VALUES 
        (@Event1, 50000000, N'DEPOSIT', N'PAID'),
        (@Event2, 45000000, N'DEPOSIT', N'PAID');
END;
GO
