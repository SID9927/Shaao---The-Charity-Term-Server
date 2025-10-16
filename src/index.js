import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './db.js';
import { router as entriesRouter } from './routes/entries.js';
import { router as sendEmailRouter } from './routes/email.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));

// Health check
app.get('/health', (_, res) => res.json({ ok: true }));

// Routes
app.use('/api/entries', entriesRouter);
app.use('/api/send-email', sendEmailRouter);

// Connect to MongoDB and start server
connectDB(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      // console.log("Connecting to:", process.env.MONGODB_URI);
    });
  })
  .catch((err) => {
    console.error('Failed to connect DB', err);
    process.exit(1);
  });