export const demoDashboardSummary = {
  weddingCount: 12,
  guestCount: 184,
  revenue: 4200000000,
  upcomingEvents: [
    { id: 1, eventDate: '2026-08-15T18:00:00.000Z', customer: { fullName: 'Nguyễn Văn An' }, venue: { name: 'Sảnh Tiêu Vương' } },
    { id: 2, eventDate: '2026-09-10T19:00:00.000Z', customer: { fullName: 'Trần Thị Bình' }, venue: { name: 'Sảnh Hoa Cúc' } },
    { id: 3, eventDate: '2026-10-02T17:30:00.000Z', customer: { fullName: 'Lê Minh Châu' }, venue: { name: 'Sảnh Bạch Lan' } }
  ]
};

export const demoVenues = [
  { id: 1, name: 'Sảnh Tiêu Vương', capacity: 300, price: 150000000, status: 'AVAILABLE' },
  { id: 2, name: 'Sảnh Hoa Cúc', capacity: 200, price: 120000000, status: 'AVAILABLE' },
  { id: 3, name: 'Sảnh Bạch Lan', capacity: 250, price: 180000000, status: 'BOOKED' }
];

export const demoCustomers = [
  { id: 1, fullName: 'Nguyễn Văn An', phone: '0901111111', email: 'an@example.com', address: 'Hà Nội', notes: 'Khách hàng ưu tiên' },
  { id: 2, fullName: 'Trần Thị Bình', phone: '0902222222', email: 'binh@example.com', address: 'Đà Nẵng', notes: 'Yêu cầu trang trí sang trọng' },
  { id: 3, fullName: 'Lê Minh Châu', phone: '0903333333', email: 'chau@example.com', address: 'TP. HCM', notes: 'Ưu tiên thực đơn chay' }
];

export const demoMenus = [
  { id: 1, appetizer: 'Gỏi tôm thịt', mainCourse: 'Bò bít tết', dessert: 'Panna cotta', beverage: 'Nước ép dâu' },
  { id: 2, appetizer: 'Salad hải sản', mainCourse: 'Gà quay', dessert: 'Tiramisu', beverage: 'Cocktail hoa quả' },
  { id: 3, appetizer: 'Gỏi xoài', mainCourse: 'Tôm sú', dessert: 'Cheesecake', beverage: 'Nước cam' }
];

export const demoServices = [
  { id: 1, name: 'MC', description: 'Điều phối chương trình', price: 5000000 },
  { id: 2, name: 'Ca sĩ', description: 'Trình diễn trong lễ cưới', price: 8000000 },
  { id: 3, name: 'Trang trí', description: 'Trang trí sảnh và bàn tiệc', price: 12000000 }
];

export const demoEvents = [
  { id: 1, eventDate: '2026-08-15T18:00:00.000Z', eventTime: '18:00', venueId: 1, customerId: 1, menuId: 1, serviceId: 1, status: 'CONFIRMED', totalAmount: 180000000, depositAmount: 45000000, venue: { name: 'Sảnh Tiêu Vương' }, customer: { fullName: 'Nguyễn Văn An' }, menu: { appetizer: 'Gỏi tôm thịt' }, service: { name: 'MC' } },
  { id: 2, eventDate: '2026-09-10T19:00:00.000Z', eventTime: '19:00', venueId: 2, customerId: 2, menuId: 2, serviceId: 2, status: 'PENDING', totalAmount: 220000000, depositAmount: 50000000, venue: { name: 'Sảnh Hoa Cúc' }, customer: { fullName: 'Trần Thị Bình' }, menu: { appetizer: 'Salad hải sản' }, service: { name: 'Ca sĩ' } },
  { id: 3, eventDate: '2026-10-02T17:30:00.000Z', eventTime: '17:30', venueId: 3, customerId: 3, menuId: 3, serviceId: 3, status: 'CONFIRMED', totalAmount: 260000000, depositAmount: 70000000, venue: { name: 'Sảnh Bạch Lan' }, customer: { fullName: 'Lê Minh Châu' }, menu: { appetizer: 'Gỏi xoài' }, service: { name: 'Trang trí' } }
];

export const demoGuests = [
  { id: 1, name: 'Nguyễn Thị Lan', phone: '0911000001', email: 'lan@example.com', tableNumber: 1, status: 'CONFIRMED', weddingEventId: 1, weddingEvent: { id: 1, customer: { fullName: 'Nguyễn Văn An' } } },
  { id: 2, name: 'Trần Văn Hoàng', phone: '0911000002', email: 'hoang@example.com', tableNumber: 2, status: 'PENDING', weddingEventId: 1, weddingEvent: { id: 1, customer: { fullName: 'Nguyễn Văn An' } } },
  { id: 3, name: 'Lý Thu Hà', phone: '0911000003', email: 'ha@example.com', tableNumber: 3, status: 'CONFIRMED', weddingEventId: 2, weddingEvent: { id: 2, customer: { fullName: 'Trần Thị Bình' } } }
];

export const demoContracts = [
  { id: 1, customerId: 1, totalValue: 180000000, depositAmount: 45000000, status: 'SIGNED', pdfUrl: '/contracts/an.pdf', customer: { fullName: 'Nguyễn Văn An' } },
  { id: 2, customerId: 2, totalValue: 220000000, depositAmount: 50000000, status: 'PENDING', pdfUrl: '/contracts/binh.pdf', customer: { fullName: 'Trần Thị Bình' } },
  { id: 3, customerId: 3, totalValue: 260000000, depositAmount: 70000000, status: 'SIGNED', pdfUrl: '/contracts/chau.pdf', customer: { fullName: 'Lê Minh Châu' } }
];

export const demoPayments = [
  { id: 1, eventId: 1, amount: 45000000, type: 'DEPOSIT', status: 'PAID', weddingEvent: { id: 1, customer: { fullName: 'Nguyễn Văn An' } } },
  { id: 2, eventId: 1, amount: 70000000, type: 'FINAL', status: 'PENDING', weddingEvent: { id: 1, customer: { fullName: 'Nguyễn Văn An' } } },
  { id: 3, eventId: 2, amount: 50000000, type: 'DEPOSIT', status: 'PAID', weddingEvent: { id: 2, customer: { fullName: 'Trần Thị Bình' } } }
];
