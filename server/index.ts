import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Initialize database & Supabase connection check
import './db/supabaseClient.js';
import { db } from './db/database.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import promotionRoutes from './routes/promotionRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import cancellationRoutes from './routes/cancellationRoutes.js';
import returnRefundRoutes from './routes/returnRefundRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    brand: 'CLEVARA',
    market: 'Nepal',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/delivery-zones', deliveryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/cancellations', cancellationRoutes);
app.use('/api', returnRefundRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

// In production, serve static assets from dist/client
const distClientPath = path.resolve(process.cwd(), 'dist', 'client');
app.use(express.static(distClientPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(distClientPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // In dev mode when client is served by Vite on port 3000
      res.status(200).send('CLEVARA API Server running. Open client at http://localhost:3000');
    }
  });
});

// Central Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[CLEVARA Server Error]:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'An internal server error occurred.' : err.message
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`CLEVARA Backend API Server running on port ${PORT}`);
  console.log(`Market: Nepal | Private-Label Consumer Products`);
  console.log(`=======================================================`);
});

export default app;
