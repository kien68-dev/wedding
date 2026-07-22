import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { createServer } from 'http';
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import venueRoutes from './routes/venueRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import weddingEventRoutes from './routes/weddingEventRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import guestRoutes from './routes/guestRoutes.js';
import contractRoutes from './routes/contractRoutes.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 5000);

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wedding Manager API',
      version: '1.0.0',
      description: 'REST API for wedding management system'
    }
  },
  apis: ['./src/routes/*.ts']
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/wedding-events', weddingEventRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/contracts', contractRoutes);

app.get('/', (_, res) => {
  res.json({ message: 'Wedding Manager API is running' });
});

const server = createServer(app);

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api-docs`);
});
