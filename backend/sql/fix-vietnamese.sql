-- Insert Vietnamese data with correct encoding
INSERT INTO [dbo].[Venues] ([Name], [Capacity], [Price], [Status], [ImageUrl])
VALUES 
    (N'Sảnh Tiểu Vương', 300, 150000000, N'AVAILABLE', N'/images/venue-1.jpg'),
    (N'Sảnh Hoa Cúc', 200, 120000000, N'AVAILABLE', N'/images/venue-2.jpg');

INSERT INTO [dbo].[Customers] ([FullName], [Phone], [Email], [Address], [Notes])
VALUES 
    (N'Nguyễn Văn A', N'0901111111', N'a@example.com', N'Hà Nội', N'Khách hàng ưu tiên'),
    (N'Trần Thị B', N'0902222222', N'b@example.com', N'Đà Nẵng', N'Yêu cầu trang trí sang trọng');

INSERT INTO [dbo].[Menus] ([Appetizer], [MainCourse], [Dessert], [Beverage], [ImageUrl])
VALUES 
    (N'Gỏi tôm thịt', N'Bò bít tết', N'Panna cotta', N'Nước ép dâu', N'/images/menu-1.jpg'),
    (N'Salad hải sản', N'Gà quay', N'Tiramisu', N'Cocktail hoa quả', N'/images/menu-2.jpg');

INSERT INTO [dbo].[Services] ([Name], [Description], [Price])
VALUES 
    (N'MC', N'Điều phối chương trình', 5000000),
    (N'Ca sĩ', N'Trình diễn trong lễ cưới', 8000000),
    (N'Nhiếp ảnh', N'Chụp ảnh và quay video', 10000000);

DECLARE @Venue1 INT = (SELECT TOP 1 [Id] FROM [dbo].[Venues] WHERE [Name] = N'Sảnh Tiểu Vương');
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

DECLARE @Event1 INT = (SELECT TOP 1 [Id] FROM [dbo].[WeddingEvents] WHERE [EventTime] = N'18:00');
DECLARE @Event2 INT = (SELECT TOP 1 [Id] FROM [dbo].[WeddingEvents] WHERE [EventTime] = N'19:00');

INSERT INTO [dbo].[Guests] ([Name], [Phone], [Email], [TableNumber], [Status], [WeddingEventId])
VALUES 
    (N'Phạm Minh Tuấn', N'0912345678', N'tuan@example.com', 1, N'PENDING', @Event1),
    (N'Lê Thị Hương', N'0987654321', N'huong@example.com', 2, N'ATTENDED', @Event1),
    (N'Đặng Quốc An', N'0933333333', N'an@example.com', 3, N'PENDING', @Event2);

INSERT INTO [dbo].[Contracts] ([CustomerId], [TotalValue], [DepositAmount], [Status], [PdfUrl])
VALUES 
    (@Customer1, 250000000, 50000000, N'PENDING', N'/files/contract-1.pdf'),
    (@Customer2, 220000000, 45000000, N'ACTIVE', N'/files/contract-2.pdf');

INSERT INTO [dbo].[Payments] ([EventId], [Amount], [Type], [Status])
VALUES 
    (@Event1, 50000000, N'DEPOSIT', N'PAID'),
    (@Event2, 45000000, N'DEPOSIT', N'PAID');
