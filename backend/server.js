const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const flashcardRoutes = require('./routes/flashcardRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Added admin routes
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Added logging middleware for better debugging

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
}); // Default route for root access

app.use('/api/users', userRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/admin', adminRoutes); // Added admin routes

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
