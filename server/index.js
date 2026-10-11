const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// --- Connect to Database ---
const dns = require('dns');
const seedDB = require('./seed');

const checkMongoSrv = (uri) => {
  return new Promise((resolve) => {
    if (!uri || !uri.startsWith('mongodb+srv://')) return resolve(true);
    const match = uri.match(/mongodb\+srv:\/\/(?:[^:]+:[^@]+@)?([^/?]+)/);
    if (!match) return resolve(true);
    const host = match[1];
    dns.resolveSrv(`_mongodb._tcp.${host}`, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

const connectDB = async () => {
  let connected = false;
  if (process.env.MONGO_URI) {
    console.log('🔌 Verifying MongoDB connection string...');
    const isValidDns = await checkMongoSrv(process.env.MONGO_URI);
    if (isValidDns) {
      try {
        await mongoose.connect(process.env.MONGO_URI, {
          serverSelectionTimeoutMS: 3000,
          connectTimeoutMS: 3000
        });
        connected = true;
        console.log('✅ Connected to MongoDB Atlas');
      } catch (err) {
        console.warn('⚠️ Could not connect to remote MONGO_URI:', err.message);
        await mongoose.disconnect().catch(() => {});
      }
    } else {
      console.warn('⚠️ MongoDB SRV domain could not be resolved by DNS.');
    }
  }

  if (!connected) {
    try {
      console.log('🔄 Starting local In-Memory MongoDB server (v7.0.14)...');
      process.env.MONGOMS_VERSION = '7.0.14';
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create({
        binary: { version: '7.0.14', checkMD5: false }
      });
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log('✅ Connected to local In-Memory MongoDB');
      console.log('🌱 Seeding initial database records...');
      await seedDB();
      console.log('✅ Database auto-seeded successfully!');
    } catch (memErr) {
      console.error('❌ In-Memory MongoDB Error:', memErr.message);
      process.exit(1);
    }
  }
};

connectDB();

mongoose.connection.on('disconnected', () => {
  console.error('❌ MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

const { trafficLogger } = require('./middleware/trafficLogger');

// --- SECURITY MIDDLEWARE (ORDER MATTERS) ---

// 1. Helmet (Secure Headers) - Should be first
app.use(helmet());

// 2. CORS - Allow cross-origin requests
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_URL
    : 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-auth-token']
};
app.use(cors(corsOptions));

// Fix for Rate Limit "X-Forwarded-For" warning
app.set('trust proxy', 1);

// 3. Rate Limiting (DoS Protection) - Apply before parsing body
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// 4. Body Parser (Express 5 handles query parsing automatically)
app.use(express.json());

// 5. Custom Data Sanitization (Express 5 Compatible)
// Removes keys starting with '$' (NoSQL Injection) AND escapes HTML chars (XSS)
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return;

    for (let key in obj) {
      if (key.startsWith('$')) {
        delete obj[key]; // Remove Mongo operators
      } else if (typeof obj[key] === 'string') {
        // Basic HTML Escape for XSS prevention
        // Replaces <, >, &, ", ' with entities
        obj[key] = obj[key]
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      } else {
        sanitize(obj[key]); // Recurse
      }
    }
  };

  // Sanitize body and params (safe to modify)
  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);

  // Note: req.query is read-only in Express 5, so we rely on 
  // Mongoose schema validation to catch query injection there.
  next();
});

app.use(trafficLogger); // Monitor Traffic

// --- API Routes ---
app.get('/', (req, res) => {
  res.send('CyberGuard API is running...');
});

// Health Check Endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: Date.now(),
    uptime: process.uptime(),
    database: 'disconnected'
  };

  try {
    if (mongoose.connection.readyState === 1) {
      health.database = 'connected';
      res.status(200).json(health);
    } else {
      health.status = 'unhealthy';
      res.status(503).json(health);
    }
  } catch (err) {
    health.status = 'error';
    health.error = err.message;
    res.status(503).json(health);
  }
});

// Your existing auth route
app.use('/api/auth', require('./routes/auth'));
app.use('/api/analyze', require('./routes/analysis'));
app.use('/api/scenarios', require('./routes/scenarios'));
app.use('/api/training', require('./routes/training'));
app.use('/api/user', require('./routes/user'));
app.use('/api/certificates', require('./routes/certificate'));
app.use('/api/admin', require('./routes/admin'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err.stack);
  res.status(500).json({
    msg: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});


// --- Start Server ---
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
