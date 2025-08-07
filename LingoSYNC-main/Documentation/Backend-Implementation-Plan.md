# LingoSYNC Backend Implementation Plan

## Quick Start Guide

### 1. Initial Setup
```bash
# Create backend directory
mkdir lingosync-backend
cd lingosync-backend

# Initialize project
npm init -y

# Install core dependencies
npm install express mongoose bcryptjs jsonwebtoken cors helmet dotenv

# Install development dependencies
npm install --save-dev nodemon jest supertest eslint prettier

# Create basic directory structure
mkdir -p src/{config,controllers,middleware,models,routes,services,utils}
mkdir -p tests/{unit,integration,e2e}
mkdir uploads logs
```

### 2. Environment Setup
```bash
# Create .env file
touch .env

# Add environment variables
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/lingosync
JWT_SECRET=your-super-secret-jwt-key-here
GROQ_API_KEY=your-groq-api-key-here
```

## Phase-by-Phase Implementation

### Phase 1: Foundation (Week 1-2)

#### Day 1-2: Project Setup
- [ ] Initialize Node.js project
- [ ] Install dependencies
- [ ] Set up ESLint and Prettier
- [ ] Create basic Express server
- [ ] Set up MongoDB connection

#### Day 3-4: Database Models
- [ ] Create User model
- [ ] Create LearningSession model
- [ ] Create Word model
- [ ] Create Conversation model
- [ ] Set up model relationships

#### Day 5-7: Authentication System
- [ ] Implement JWT authentication
- [ ] Create auth middleware
- [ ] Set up password hashing
- [ ] Create registration endpoint
- [ ] Create login endpoint

#### Day 8-10: Basic CRUD Operations
- [ ] User profile management
- [ ] Basic error handling
- [ ] Request validation
- [ ] Response formatting
- [ ] Basic testing setup

#### Day 11-14: Core Infrastructure
- [ ] File upload system
- [ ] Logging system
- [ ] Security middleware
- [ ] Rate limiting
- [ ] CORS configuration

### Phase 2: Core Features (Week 3-4)

#### Day 15-17: Learning Session Management
- [ ] Create session endpoints
- [ ] Session tracking logic
- [ ] Progress calculation
- [ ] Session analytics

#### Day 18-20: Word Tracking System
- [ ] Word CRUD operations
- [ ] Mastery tracking
- [ ] Spaced repetition logic
- [ ] Word difficulty assessment

#### Day 21-24: Progress Analytics
- [ ] Statistics calculation
- [ ] Streak tracking
- [ ] Achievement system
- [ ] Progress reports

#### Day 25-28: File Management
- [ ] Audio file upload
- [ ] File storage system
- [ ] File validation
- [ ] CDN integration

### Phase 3: AI Integration (Week 5-6)

#### Day 29-31: Groq API Integration
- [ ] Set up Groq client
- [ ] Conversation endpoints
- [ ] AI response handling
- [ ] Error handling

#### Day 32-35: Conversation Management
- [ ] Conversation CRUD
- [ ] Message handling
- [ ] Context management
- [ ] Conversation analytics

#### Day 36-38: Speech Processing
- [ ] Audio transcription
- [ ] Pronunciation analysis
- [ ] Speech-to-text integration
- [ ] Accuracy scoring

#### Day 39-42: Real-time Features
- [ ] WebSocket setup
- [ ] Real-time chat
- [ ] Live feedback
- [ ] Connection management

### Phase 4: Advanced Features (Week 7-8)

#### Day 43-45: WebSocket Implementation
- [ ] Socket.io setup
- [ ] Event handlers
- [ ] Room management
- [ ] Real-time updates

#### Day 46-48: Notification System
- [ ] Push notifications
- [ ] Email notifications
- [ ] In-app notifications
- [ ] Notification preferences

#### Day 49-51: Achievement System
- [ ] Achievement logic
- [ ] Progress tracking
- [ ] Reward system
- [ ] Leaderboards

#### Day 52-56: Advanced Analytics
- [ ] Learning analytics
- [ ] Performance metrics
- [ ] Data visualization
- [ ] Export functionality

### Phase 5: Testing & Optimization (Week 9-10)

#### Day 57-59: Unit Testing
- [ ] Controller tests
- [ ] Service tests
- [ ] Model tests
- [ ] Utility tests

#### Day 60-62: Integration Testing
- [ ] API endpoint tests
- [ ] Database integration tests
- [ ] Authentication tests
- [ ] File upload tests

#### Day 63-65: Performance Optimization
- [ ] Database indexing
- [ ] Query optimization
- [ ] Caching implementation
- [ ] Memory optimization

#### Day 66-70: Security & Documentation
- [ ] Security audit
- [ ] API documentation
- [ ] Code documentation
- [ ] Deployment preparation

### Phase 6: Deployment (Week 11-12)

#### Day 71-73: Production Setup
- [ ] Environment configuration
- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Monitoring setup

#### Day 74-77: Testing & Monitoring
- [ ] Load testing
- [ ] Performance monitoring
- [ ] Error tracking
- [ ] Health checks

#### Day 78-84: Launch Preparation
- [ ] Final testing
- [ ] Documentation review
- [ ] Deployment
- [ ] Post-launch monitoring

## Starter Code Examples

### 1. Basic Express Server Setup

```javascript
// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/learning', require('./routes/learning'));
app.use('/api/conversations', require('./routes/conversations'));

// Error handling
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
```

### 2. Database Connection

```javascript
// src/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### 3. User Model

```javascript
// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String,
    nativeLanguage: String
  },
  preferences: {
    learningLanguages: [{
      language: String,
      proficiency: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
      },
      isActive: {
        type: Boolean,
        default: true
      }
    }],
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  },
  stats: {
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastUpdated: Date
    },
    totalHoursPracticed: { type: Number, default: 0 },
    totalWordsLearned: { type: Number, default: 0 },
    joinDate: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now }
  },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### 4. Authentication Controller

```javascript
// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'User with this email already exists'
        }
      });
    }

    // Create new user
    const user = new User({
      email,
      password,
      profile: { firstName, lastName }
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          profile: user.profile
        },
        token
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'REGISTRATION_ERROR',
        message: error.message
      }
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Update last active
    user.stats.lastActive = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          profile: user.profile,
          stats: user.stats
        },
        token
      },
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGIN_ERROR',
        message: error.message
      }
    });
  }
};
```

### 5. Authentication Middleware

```javascript
// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'NO_TOKEN',
          message: 'Access token required'
        }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired token'
        }
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: 'Authentication failed'
      }
    });
  }
};

module.exports = auth;
```

### 6. Error Handling Middleware

```javascript
// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: Object.values(err.errors).map(e => ({
          field: e.path,
          message: e.message
        }))
      }
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid token'
      }
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Token expired'
      }
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong'
    }
  });
};

module.exports = errorHandler;
```

### 7. Package.json Scripts

```json
{
  "name": "lingosync-backend",
  "version": "1.0.0",
  "description": "LingoSYNC Backend API",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write src/",
    "db:seed": "node scripts/seed.js",
    "db:reset": "node scripts/reset.js"
  },
  "keywords": ["language-learning", "api", "nodejs", "express", "mongodb"],
  "author": "LingoSYNC Team",
  "license": "MIT"
}
```

## Testing Strategy

### Unit Tests Example

```javascript
// tests/unit/authController.test.js
const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const mongoose = require('mongoose');

describe('Auth Controller', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should not register user with existing email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Try to create second user with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('USER_EXISTS');
    });
  });
});
```

## Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] SSL certificates obtained
- [ ] Domain configured
- [ ] Monitoring setup

### Deployment Steps
1. **Set up production environment**
2. **Configure database**
3. **Deploy application**
4. **Set up load balancer**
5. **Configure SSL**
6. **Set up monitoring**
7. **Run smoke tests**
8. **Monitor performance**

### Post-deployment
- [ ] Monitor application logs
- [ ] Check database performance
- [ ] Verify all endpoints
- [ ] Test authentication flow
- [ ] Monitor error rates
- [ ] Check response times

## Next Steps

1. **Start with Phase 1** - Set up the foundation
2. **Follow the daily tasks** - Complete each day's objectives
3. **Test continuously** - Write tests as you develop
4. **Document as you go** - Keep documentation updated
5. **Review and iterate** - Regular code reviews and improvements

This implementation plan provides a structured approach to building the LingoSYNC backend with clear milestones and deliverables.
