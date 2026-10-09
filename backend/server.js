require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

// Connect to Database
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
const frontendDistPath = path.join(__dirname, '../frontend/dist');
const rootDistPath = path.join(__dirname, '../dist');

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else if (fs.existsSync(rootDistPath)) {
  app.use(express.static(rootDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(rootDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('New Ajeet Vision API is running...');
  });
}

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
