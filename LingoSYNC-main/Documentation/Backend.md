# LingoSYNC Backend Documentation

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Database Design](#database-design)
5. [API Design](#api-design)
6. [Authentication & Security](#authentication--security)
7. [File Structure](#file-structure)
8. [Implementation Plan](#implementation-plan)
9. [Development Guidelines](#development-guidelines)
10. [Deployment](#deployment)

## Overview

The LingoSYNC backend is a **Node.js** application built with **Express.js** and **MongoDB**, designed to support the language learning mobile application. The backend provides user authentication, data persistence, AI integration, and real-time features.

### Key Features
- **User Authentication**: JWT-based authentication with social login
- **Data Persistence**: MongoDB for user data, progress tracking, and learning history
- **AI Integration**: Groq API integration for conversation and speech processing
- **Real-time Features**: WebSocket support for live chat and notifications
- **File Management**: Audio file upload and storage
- **Analytics**: Learning progress tracking and analytics

## Technology Stack

### Core Technologies
```json
{
  "node": "18.x+",
  "express": "^4.18.2",
  "mongodb": "^6.0.0",
  "mongoose": "^8.0.0"
}
```

### Key Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "cors": "^2.8.5",
  "helmet": "^7.1.0",
  "express-rate-limit": "^7.1.5",
  "multer": "^1.4.5-lts.1",
  "socket.io": "^4.7.4",
  "dotenv": "^16.3.1",
  "joi": "^17.11.0",
  "morgan": "^1.10.0",
  "compression": "^1.7.4"
}
```

### Development Dependencies
```json
{
  "nodemon": "^3.0.2",
  "jest": "^29.7.0",
  "supertest": "^6.3.3",
  "eslint": "^8.55.0",
  "prettier": "^3.1.0"
}
```

## Architecture

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Native  │    │   Web Client    │    │   Admin Panel   │
│     Mobile      │    │   (Future)      │    │   (Future)      │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │      Express.js API       │
                    │      (Node.js)            │
                    └─────────────┬─────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
┌─────────▼─────────┐  ┌─────────▼─────────┐  ┌─────────▼─────────┐
│    MongoDB        │  │   Redis Cache     │  │   File Storage    │
│   (Primary DB)    │  │   (Session/Data)  │  │   (Audio Files)   │
└───────────────────┘  └───────────────────┘  └───────────────────┘
          │                       │                       │
          └───────────────────────┼───────────────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │    External Services      │
                    │  - Groq AI API            │
                    │  - Dictionary API         │
                    │  - Email Service          │
                    └───────────────────────────┘
```

### Application Layers

#### 1. **Presentation Layer**
- RESTful API endpoints
- WebSocket connections
- File upload handling
- Request/Response formatting

#### 2. **Business Logic Layer**
- User authentication & authorization
- Learning progress tracking
- AI conversation management
- Analytics processing

#### 3. **Data Access Layer**
- MongoDB operations
- Redis caching
- File storage management
- External API integrations

#### 4. **Infrastructure Layer**
- Database connections
- Security middleware
- Logging & monitoring
- Error handling

## Database Design

### MongoDB Schema Design

#### 1. User Collection
```javascript
{
  _id: ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
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
    dateOfBirth: Date,
    nativeLanguage: String
  },
  preferences: {
    learningLanguages: [{
      language: String,
      proficiency: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced']
      },
      isActive: Boolean
    }],
    notifications: {
      email: Boolean,
      push: Boolean,
      reminders: Boolean
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'private', 'friends']
      },
      dataSharing: Boolean
    }
  },
  stats: {
    streak: {
      current: Number,
      longest: Number,
      lastUpdated: Date
    },
    totalHoursPracticed: Number,
    totalWordsLearned: Number,
    totalConversations: Number,
    joinDate: Date,
    lastActive: Date
  },
  social: {
    facebookId: String,
    googleId: String,
    appleId: String
  },
  isVerified: Boolean,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. Learning Session Collection
```javascript
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  sessionType: {
    type: String,
    enum: ['conversation', 'pronunciation', 'vocabulary', 'grammar']
  },
  language: {
    type: String,
    required: true
  },
  duration: Number, // in minutes
  startTime: Date,
  endTime: Date,
  progress: {
    wordsLearned: Number,
    accuracy: Number,
    fluency: Number
  },
  content: {
    topics: [String],
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced']
    },
    materials: [{
      type: String,
      content: String,
      timestamp: Date
    }]
  },
  aiInteractions: [{
    message: String,
    response: String,
    timestamp: Date,
    feedback: {
      accuracy: Number,
      suggestions: [String]
    }
  }],
  createdAt: Date
}
```

#### 3. Word Collection
```javascript
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  word: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  definition: String,
  phonetic: String,
  audioUrl: String,
  examples: [String],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard']
  },
  mastery: {
    level: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    practiceCount: Number,
    lastPracticed: Date,
    nextReview: Date
  },
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. Conversation Collection
```javascript
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  language: {
    type: String,
    required: true
  },
  topic: String,
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant', 'system']
    },
    content: String,
    timestamp: Date,
    metadata: {
      pronunciation: Number,
      grammar: Number,
      vocabulary: Number
    }
  }],
  summary: {
    totalMessages: Number,
    userMessages: Number,
    aiMessages: Number,
    duration: Number,
    topics: [String],
    vocabulary: [String],
    grammarErrors: [String],
    suggestions: [String]
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed'],
    default: 'active'
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### 5. Pronunciation Practice Collection
```javascript
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  word: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  attempts: [{
    audioFile: String,
    transcription: String,
    accuracy: Number,
    feedback: [String],
    timestamp: Date
  }],
  bestScore: Number,
  averageScore: Number,
  totalAttempts: Number,
  lastPracticed: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### 6. Achievement Collection
```javascript
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  achievements: [{
    type: {
      type: String,
      enum: ['streak', 'words', 'hours', 'conversations', 'accuracy']
    },
    title: String,
    description: String,
    icon: String,
    criteria: {
      target: Number,
      current: Number
    },
    unlocked: Boolean,
    unlockedAt: Date,
    progress: Number
  }],
  totalAchievements: Number,
  unlockedAchievements: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## API Design

### RESTful API Endpoints

#### Authentication Endpoints
```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login
POST   /api/auth/logout            # User logout
POST   /api/auth/refresh           # Refresh JWT token
POST   /api/auth/forgot-password   # Forgot password
POST   /api/auth/reset-password    # Reset password
POST   /api/auth/verify-email      # Email verification
POST   /api/auth/social/google     # Google OAuth
POST   /api/auth/social/facebook   # Facebook OAuth
POST   /api/auth/social/apple      # Apple OAuth
```

#### User Management Endpoints
```
GET    /api/users/profile          # Get user profile
PUT    /api/users/profile          # Update user profile
DELETE /api/users/profile          # Delete user account
GET    /api/users/stats            # Get user statistics
PUT    /api/users/preferences      # Update user preferences
POST   /api/users/avatar           # Upload avatar
GET    /api/users/achievements     # Get user achievements
```

#### Learning Endpoints
```
GET    /api/learning/sessions      # Get learning sessions
POST   /api/learning/sessions      # Create new session
GET    /api/learning/sessions/:id  # Get specific session
PUT    /api/learning/sessions/:id  # Update session
DELETE /api/learning/sessions/:id  # Delete session

GET    /api/learning/words         # Get learned words
POST   /api/learning/words         # Add new word
PUT    /api/learning/words/:id     # Update word mastery
DELETE /api/learning/words/:id     # Remove word

GET    /api/learning/progress      # Get learning progress
POST   /api/learning/progress      # Update progress
```

#### Conversation Endpoints
```
GET    /api/conversations          # Get conversations
POST   /api/conversations          # Start new conversation
GET    /api/conversations/:id      # Get conversation
POST   /api/conversations/:id/messages  # Send message
PUT    /api/conversations/:id      # Update conversation
DELETE /api/conversations/:id      # Delete conversation

POST   /api/conversations/ai/chat  # AI chat endpoint
POST   /api/conversations/ai/analyze  # Analyze conversation
```

#### Pronunciation Endpoints
```
POST   /api/pronunciation/record   # Upload audio recording
POST   /api/pronunciation/analyze  # Analyze pronunciation
GET    /api/pronunciation/history  # Get practice history
POST   /api/pronunciation/words    # Get practice words
PUT    /api/pronunciation/words/:id # Update word practice
```

#### Analytics Endpoints
```
GET    /api/analytics/overview     # Get analytics overview
GET    /api/analytics/streak       # Get streak analytics
GET    /api/analytics/progress     # Get progress analytics
GET    /api/analytics/performance  # Get performance analytics
GET    /api/analytics/export       # Export analytics data
```

### API Response Format

#### Success Response
```javascript
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful",
  "timestamp": "2024-12-19T10:30:00Z"
}
```

#### Error Response
```javascript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2024-12-19T10:30:00Z"
}
```

### WebSocket Events

#### Client to Server
```javascript
// Join learning session
socket.emit('join-session', { sessionId, userId });

// Send message in conversation
socket.emit('send-message', { 
  conversationId, 
  message, 
  language 
});

// Start pronunciation practice
socket.emit('start-pronunciation', { 
  word, 
  language 
});

// Audio recording
socket.emit('audio-data', { 
  audioBuffer, 
  sessionId 
});
```

#### Server to Client
```javascript
// AI response
socket.emit('ai-response', { 
  message, 
  analysis, 
  suggestions 
});

// Pronunciation feedback
socket.emit('pronunciation-feedback', { 
  accuracy, 
  transcription, 
  suggestions 
});

// Progress update
socket.emit('progress-update', { 
  stats, 
  achievements 
});

// Notification
socket.emit('notification', { 
  type, 
  message, 
  data 
});
```

## Authentication & Security

### JWT Authentication Flow

```javascript
// JWT Configuration
const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: '7d',
  refreshExpiresIn: '30d'
};

// Token Generation
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId, type: 'access' },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );
  
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    jwtConfig.secret,
    { expiresIn: jwtConfig.refreshExpiresIn }
  );
  
  return { accessToken, refreshToken };
};
```

### Security Middleware

```javascript
// Rate limiting
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts'
});

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

### Password Security

```javascript
// Password hashing
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Password verification
const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Password validation
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return password.length >= minLength && 
         hasUpperCase && 
         hasLowerCase && 
         hasNumbers && 
         hasSpecialChar;
};
```

## File Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   ├── redis.js             # Redis connection
│   │   ├── multer.js            # File upload config
│   │   └── socket.js            # WebSocket config
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── userController.js    # User management
│   │   ├── learningController.js # Learning sessions
│   │   ├── conversationController.js # AI conversations
│   │   ├── pronunciationController.js # Speech analysis
│   │   └── analyticsController.js # Analytics & stats
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── validation.js        # Request validation
│   │   ├── rateLimit.js         # Rate limiting
│   │   ├── errorHandler.js      # Error handling
│   │   └── upload.js            # File upload
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── LearningSession.js   # Session model
│   │   ├── Word.js              # Word model
│   │   ├── Conversation.js      # Conversation model
│   │   ├── Pronunciation.js     # Pronunciation model
│   │   └── Achievement.js       # Achievement model
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── users.js             # User routes
│   │   ├── learning.js          # Learning routes
│   │   ├── conversations.js     # Conversation routes
│   │   ├── pronunciation.js     # Pronunciation routes
│   │   └── analytics.js         # Analytics routes
│   ├── services/
│   │   ├── aiService.js         # Groq AI integration
│   │   ├── emailService.js      # Email notifications
│   │   ├── fileService.js       # File management
│   │   ├── analyticsService.js  # Analytics processing
│   │   └── notificationService.js # Push notifications
│   ├── utils/
│   │   ├── logger.js            # Logging utility
│   │   ├── validation.js        # Validation schemas
│   │   ├── encryption.js        # Encryption utilities
│   │   └── helpers.js           # Helper functions
│   ├── socket/
│   │   ├── handlers.js          # WebSocket handlers
│   │   ├── events.js            # Event definitions
│   │   └── middleware.js        # Socket middleware
│   └── app.js                   # Express app setup
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── uploads/                      # File upload directory
├── logs/                         # Application logs
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── package.json                  # Dependencies
├── package-lock.json
├── jest.config.js               # Jest configuration
├── .eslintrc.js                 # ESLint configuration
├── .prettierrc                  # Prettier configuration
└── README.md                    # Backend documentation
```

## Implementation Plan

### Phase 1: Foundation (Week 1-2)
- [ ] Project setup and configuration
- [ ] Database schema design and implementation
- [ ] Basic Express server setup
- [ ] Authentication system (JWT)
- [ ] User CRUD operations
- [ ] Basic middleware implementation

### Phase 2: Core Features (Week 3-4)
- [ ] Learning session management
- [ ] Word tracking system
- [ ] Progress analytics
- [ ] File upload system
- [ ] Basic error handling

### Phase 3: AI Integration (Week 5-6)
- [ ] Groq API integration
- [ ] Conversation management
- [ ] Speech-to-text processing
- [ ] Pronunciation analysis
- [ ] Real-time chat features

### Phase 4: Advanced Features (Week 7-8)
- [ ] WebSocket implementation
- [ ] Real-time notifications
- [ ] Achievement system
- [ ] Advanced analytics
- [ ] Social features

### Phase 5: Testing & Optimization (Week 9-10)
- [ ] Unit testing
- [ ] Integration testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation

### Phase 6: Deployment (Week 11-12)
- [ ] Production environment setup
- [ ] CI/CD pipeline
- [ ] Monitoring and logging
- [ ] Backup strategies
- [ ] Performance monitoring

## Development Guidelines

### Code Style
```javascript
// Use ES6+ features
const express = require('express');
const mongoose = require('mongoose');

// Use async/await for asynchronous operations
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Use meaningful variable names
const userLearningProgress = await LearningSession.aggregate([
  { $match: { userId: mongoose.Types.ObjectId(userId) } },
  { $group: { _id: null, totalHours: { $sum: '$duration' } } }
]);
```

### Error Handling
```javascript
// Global error handler
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: Object.values(err.errors).map(e => ({
          field: e.path,
          message: e.message
        }))
      }
    });
  }
  
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong'
    }
  });
};
```

### Validation
```javascript
// Joi validation schemas
const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  nativeLanguage: Joi.string().length(2)
});

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.details[0].message
        }
      });
    }
    next();
  };
};
```

### Logging
```javascript
// Winston logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Request logging middleware
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
```

## Deployment

### Environment Configuration
```bash
# .env file
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/lingosync
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
GROQ_API_KEY=your-groq-api-key
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=lingosync-uploads
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/lingosync
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  mongo_data:
  redis_data:
```

### Production Considerations
- **Load Balancing**: Use Nginx or HAProxy
- **SSL/TLS**: Configure HTTPS with Let's Encrypt
- **Monitoring**: Implement health checks and metrics
- **Backup**: Regular database backups
- **Scaling**: Horizontal scaling with multiple instances
- **CDN**: Use CDN for static assets and file storage

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Backend Team**: LingoSYNC Development
