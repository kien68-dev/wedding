import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@wedding.com' },
    update: {},
    create: {
      email: 'admin@wedding.com',
      passwordHash,
      name: 'Administrator',
      role: 'ADMIN'
    }
  });

  const customers = await Promise.all([
    prisma.customer.create({ data: { fullName: 'Nguyễn Văn An', phone: '0901111111', email: 'an@example.com', address: 'Hà Nội', notes: 'Khách hàng ưu tiên' } }),
    prisma.customer.create({ data: { fullName: 'Trần Thị Bình', phone: '0902222222', email: 'binh@example.com', address: 'Đà Nẵng', notes: 'Yêu cầu trang trí sang trọng' } }),
    prisma.customer.create({ data: { fullName: 'Lê Minh Châu', phone: '0903333333', email: 'chau@example.com', address: 'TP. HCM', notes: 'Ưu tiên thực đơn chay' } }),
    prisma.customer.create({ data: { fullName: 'Phạm Quốc Dũng', phone: '0904444444', email: 'dung@example.com', address: 'Cần Thơ', notes: 'Muốn bố trí sân khấu lớn' } })
  ]);

  const venues = await Promise.all([
    prisma.venue.create({ data: { name: 'Sảnh Tiêu Vương', capacity: 300, price: 150000000, status: 'AVAILABLE', imageUrl: '/images/venue-1.jpg' } }),
    prisma.venue.create({ data: { name: 'Sảnh Hoa Cúc', capacity: 200, price: 120000000, status: 'AVAILABLE', imageUrl: '/images/venue-2.jpg' } }),
    prisma.venue.create({ data: { name: 'Sảnh Bạch Lan', capacity: 250, price: 180000000, status: 'AVAILABLE', imageUrl: '/images/venue-3.jpg' } })
  ]);

  const menus = await Promise.all([
    prisma.menu.create({ data: { appetizer: 'Gỏi tôm thịt', mainCourse: 'Bò bít tết', dessert: 'Panna cotta', beverage: 'Nước ép dâu', imageUrl: '/images/menu-1.jpg' } }),
    prisma.menu.create({ data: { appetizer: 'Salad hải sản', mainCourse: 'Gà quay', dessert: 'Tiramisu', beverage: 'Cocktail hoa quả', imageUrl: '/images/menu-2.jpg' } }),
    prisma.menu.create({ data: { appetizer: 'Gỏi xoài', mainCourse: 'Tôm sú', dessert: 'Cheesecake', beverage: 'Nước cam', imageUrl: '/images/menu-3.jpg' } })
  ]);

  const services = await Promise.all([
    prisma.service.create({ data: { name: 'MC', description: 'Điều phối chương trình', price: 5000000 } }),
    prisma.service.create({ data: { name: 'Ca sĩ', description: 'Trình diễn trong lễ cưới', price: 8000000 } }),
    prisma.service.create({ data: { name: 'Trang trí', description: 'Trang trí sảnh và bàn tiệc', price: 12000000 } })
  ]);

  const weddingEvents = await Promise.all([
    prisma.weddingEvent.create({
      data: {
        eventDate: new Date('2026-08-15T18:00:00.000Z'),
        eventTime: '18:00',
        venueId: venues[0].id,
        customerId: customers[0].id,
        menuId: menus[0].id,
        serviceId: services[0].id,
        status: 'CONFIRMED',
        totalAmount: 180000000,
        depositAmount: 45000000
      }
    }),
    prisma.weddingEvent.create({
      data: {
        eventDate: new Date('2026-09-10T19:00:00.000Z'),
        eventTime: '19:00',
        venueId: venues[1].id,
        customerId: customers[1].id,
        menuId: menus[1].id,
        serviceId: services[1].id,
        status: 'PENDING',
        totalAmount: 220000000,
        depositAmount: 50000000
      }
    }),
    prisma.weddingEvent.create({
      data: {
        eventDate: new Date('2026-10-02T17:30:00.000Z'),
        eventTime: '17:30',
        venueId: venues[2].id,
        customerId: customers[2].id,
        menuId: menus[2].id,
        serviceId: services[2].id,
        status: 'CONFIRMED',
        totalAmount: 260000000,
        depositAmount: 70000000
      }
    })
  ]);

  await Promise.all([
    prisma.guest.create({ data: { name: 'Nguyễn Thị Lan', phone: '0911000001', email: 'lan@example.com', tableNumber: 1, status: 'CONFIRMED', weddingEventId: weddingEvents[0].id } }),
    prisma.guest.create({ data: { name: 'Trần Văn Hoàng', phone: '0911000002', email: 'hoang@example.com', tableNumber: 2, status: 'PENDING', weddingEventId: weddingEvents[0].id } }),
    prisma.guest.create({ data: { name: 'Lý Thu Hà', phone: '0911000003', email: 'ha@example.com', tableNumber: 3, status: 'CONFIRMED', weddingEventId: weddingEvents[1].id } }),
    prisma.guest.create({ data: { name: 'Đặng Văn Nam', phone: '0911000004', email: 'nam@example.com', tableNumber: 4, status: 'PENDING', weddingEventId: weddingEvents[2].id } })
  ]);

  await Promise.all([
    prisma.contract.create({ data: { customerId: customers[0].id, totalValue: 180000000, depositAmount: 45000000, status: 'SIGNED', pdfUrl: '/contracts/an.pdf' } }),
    prisma.contract.create({ data: { customerId: customers[1].id, totalValue: 220000000, depositAmount: 50000000, status: 'PENDING', pdfUrl: '/contracts/binh.pdf' } }),
    prisma.contract.create({ data: { customerId: customers[2].id, totalValue: 260000000, depositAmount: 70000000, status: 'SIGNED', pdfUrl: '/contracts/chau.pdf' } })
  ]);

  await Promise.all([
    prisma.payment.create({ data: { eventId: weddingEvents[0].id, amount: 45000000, type: 'DEPOSIT', status: 'PAID' } }),
    prisma.payment.create({ data: { eventId: weddingEvents[0].id, amount: 70000000, type: 'FINAL', status: 'PENDING' } }),
    prisma.payment.create({ data: { eventId: weddingEvents[1].id, amount: 50000000, type: 'DEPOSIT', status: 'PAID' } }),
    prisma.payment.create({ data: { eventId: weddingEvents[2].id, amount: 70000000, type: 'DEPOSIT', status: 'PAID' } })
  ]);

  console.log('✅ Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
