require('dotenv').config();

// Global Exception Safety
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
});

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

// Connect to Database (graceful)
connectDB();

const app = express();

const path = require('path');
const fs = require('fs');

// Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false,
}));
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint for Hostinger/Cloud health probes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'New Ajeet Vision API is running smoothly' });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/purchases', require('./routes/purchaseRoutes'));
app.use('/api/rewards', require('./routes/rewardRoutes'));
app.use('/api/vip', require('./routes/vipRoutes'));
app.use('/api/loyalty', require('./routes/loyaltyRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/offers', require('./routes/offerRoutes'));
app.use('/api/admin/dashboard', require('./routes/adminDashboardRoutes'));

// Serve React Frontend static assets in Deployment
const backendPublicPath = path.join(__dirname, 'public');
const frontendDistPath = path.join(__dirname, '../frontend/dist');
const rootDistPath = path.join(__dirname, '../dist');

const serveIndexHtml = (res, folderPath) => {
  const indexPath = path.join(folderPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error(`Error sending ${indexPath}:`, err.message);
      res.status(200).send('<h1>New Ajeet Vision</h1><p>Application is starting up...</p>');
    }
  });
};

if (fs.existsSync(backendPublicPath) && fs.existsSync(path.join(backendPublicPath, 'index.html'))) {
  app.use(express.static(backendPublicPath));
  app.get('/*path', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    serveIndexHtml(res, backendPublicPath);
  });
} else if (fs.existsSync(frontendDistPath) && fs.existsSync(path.join(frontendDistPath, 'index.html'))) {
  app.use(express.static(frontendDistPath));
  app.get('/*path', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    serveIndexHtml(res, frontendDistPath);
  });
} else if (fs.existsSync(rootDistPath) && fs.existsSync(path.join(rootDistPath, 'index.html'))) {
  app.use(express.static(rootDistPath));
  app.get('/*path', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    serveIndexHtml(res, rootDistPath);
  });
} else {
  app.get('/', (req, res) => {
    res.send('<h1>New Ajeet Vision Server Online</h1><p>API Endpoint active.</p>');
  });
}

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('Server listen error:', err.message);
});
