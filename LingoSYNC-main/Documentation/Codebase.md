# LingoSYNC Codebase Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architecture](#architecture)
5. [Core Features](#core-features)
6. [Data Management](#data-management)
7. [AI Integration](#ai-integration)
8. [UI/UX Design System](#uiux-design-system)
9. [Development Guidelines](#development-guidelines)
10. [API Documentation](#api-documentation)
11. [Deployment](#deployment)

## Project Overview

**LingoSYNC** is a React Native language learning application that combines AI-powered conversation practice with pronunciation training. The app provides an immersive language learning experience through interactive features and real-time feedback.

### Key Features
- AI-powered conversation practice in multiple languages
- Pronunciation practice with audio recording and scoring
- Progress tracking and learning statistics
- Multi-language support (8 languages)
- User profile management and settings

## Technology Stack

### Core Technologies
- **React Native**: 0.79.3
- **Expo**: ~53.0.11
- **TypeScript**: ~5.8.3
- **Expo Router**: ~5.1.0 (File-based routing)

### Key Dependencies
```json
{
  "groq-sdk": "^0.29.0",           // AI language model integration
  "expo-av": "^15.1.7",            // Audio recording and playback
  "@react-native-async-storage/async-storage": "^2.2.0", // Local storage
  "react-native-gesture-handler": "~2.24.0", // Touch gestures
  "react-native-reanimated": "~3.17.4", // Animations
  "@expo/vector-icons": "^14.1.0"  // UI icons
}
```

## Project Structure

```
LingoSYNC-main/
├── app/                          # Main application code
│   ├── _layout.tsx              # Root navigation layout
│   ├── index.tsx                # Welcome/landing screen
│   ├── login.tsx                # Login screen
│   ├── signup.tsx               # Signup screen
│   ├── language-setup.tsx       # Language selection onboarding
│   ├── profile.tsx              # User profile screen
│   ├── main/                    # Main app screens
│   │   ├── _layout.tsx          # Tab navigation layout
│   │   ├── homepage.tsx         # Dashboard/home screen
│   │   ├── conversation.tsx     # AI conversation feature
│   │   └── pronunciation-practice.tsx # Pronunciation practice
│   └── utils/                   # Utility functions
│       ├── StorageService.ts    # Local storage management
│       └── string-similarity.ts # String comparison algorithms
├── assets/                      # Static assets
│   ├── fonts/                   # Custom fonts
│   └── images/                  # App images and icons
├── Documentation/               # Project documentation
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project readme
```

## Architecture

### Navigation Architecture
The app uses a hierarchical navigation structure:

1. **Root Stack Navigator** (`app/_layout.tsx`)
   - Welcome screen
   - Authentication screens (login/signup)
   - Language setup
   - Profile screen
   - Main app container

2. **Tab Navigator** (`app/main/_layout.tsx`)
   - Homepage (Dashboard)
   - Pronunciation Practice
   - Conversation

### State Management
- **Local State**: React hooks for component-level state
- **Persistent Storage**: AsyncStorage for user data and preferences
- **No Global State**: Simple prop drilling and local state management

### Data Flow
```
User Action → Component State → StorageService → AsyncStorage
     ↓
AI/External APIs → Component Update → UI Re-render
```

## Core Features

### 1. Authentication Flow
**Files**: `app/login.tsx`, `app/signup.tsx`

**Features**:
- Email/password authentication (UI only)
- Facebook OAuth integration (UI only)
- Form validation
- Navigation between auth screens

**Key Components**:
```typescript
// Login form with email/password fields
// Facebook login button
// Navigation to signup
```

### 2. Language Setup
**File**: `app/language-setup.tsx`

**Features**:
- Multi-language selection (6 languages)
- Visual language cards with icons
- Selected languages display
- Skip/Continue navigation

**Supported Languages**:
- Spanish, French, German, Japanese, Chinese, Arabic

### 3. Dashboard (Homepage)
**File**: `app/main/homepage.tsx`

**Features**:
- **Progress Tracking**: Streak counter, hours practiced, words learned
- **Proficiency Levels**: Beginner/Intermediate selection
- **Quick Access**: Direct navigation to practice features
- **Statistics**: Real-time learning metrics
- **Auto-streak Management**: Tracks daily usage

**Key Components**:
```typescript
// Progress cards with icons and metrics
// Proficiency level selection
// Quick access cards for features
// Statistics grid
```

### 4. AI Conversation
**File**: `app/main/conversation.tsx`

**Features**:
- **Multi-language Support**: 8 languages
- **Groq AI Integration**: Llama3-8b model
- **Real-time Chat**: Typing indicators, timestamps
- **Language Switching**: Modal-based selection
- **Contextual Responses**: AI adapts to language and level

**Supported Languages**:
- English, French, German, Hindi, Italian, Portuguese, Spanish, Thai

**AI Configuration**:
```typescript
const groq = new Groq({
  apiKey: process.env.EXPO_PUBLIC_GROQ_API_KEY,
});

// System prompt for language learning assistant
const systemPrompt = `You are a helpful language learning assistant...`;
```

### 5. Pronunciation Practice
**File**: `app/main/pronunciation-practice.tsx`

**Features**:
- **Audio Recording**: 5-second sessions with visual feedback
- **Speech-to-Text**: Groq Whisper API integration
- **Similarity Scoring**: Levenshtein distance algorithm
- **Word Dictionary**: Free Dictionary API integration
- **Audio Playback**: Listen to correct pronunciations
- **Custom Words**: User-defined practice words

**Sample Words**:
```typescript
const sampleWords = [
  "hello", "world", "react", "native", "language",
  "pronunciation", "practice", "excellent", "wonderful", "beautiful"
];
```

**Scoring Algorithm**:
```typescript
// Uses Levenshtein distance for pronunciation accuracy
const similarity = calculateSimilarity(selectedWord, transcribedText);
setScore(Math.round(similarity));
```

### 6. User Profile
**File**: `app/profile.tsx`

**Features**:
- **Learning Statistics**: Comprehensive progress tracking
- **Settings Management**: Notification preferences
- **Account Options**: Language preferences, achievements, support
- **Logout Functionality**: Session management

## Data Management

### StorageService
**File**: `app/utils/StorageService.ts`

**Purpose**: Centralized local storage management using AsyncStorage

**Key Methods**:
```typescript
export const StorageService = {
  // Streak management
  async getStreak(): Promise<number>
  async setStreak(streak: number): Promise<void>
  
  // Login tracking
  async getLastLogin(): Promise<string | null>
  async setLastLogin(date: string): Promise<void>
  
  // Practice tracking
  async getHoursPracticed(): Promise<number>
  async addHourPracticed(): Promise<void>
  
  // Word tracking
  async getLearnedWords(): Promise<string[]>
  async addLearnedWord(word: string): Promise<void>
}
```

**Storage Keys**:
- `user_streak`: User's current streak count
- `last_login_date`: Last login date for streak calculation
- `hours_practiced`: Total hours practiced
- `learned_words`: Array of learned words

### Data Persistence Strategy
- **AsyncStorage**: Local device storage
- **No Backend**: All data stored locally
- **Automatic Sync**: Real-time updates across screens
- **Data Validation**: Type-safe data handling

## AI Integration

### Groq API Integration
**Model**: Llama3-8b-8192
**Features**: Text generation, speech-to-text

**Configuration**:
```typescript
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.EXPO_PUBLIC_GROQ_API_KEY,
});
```

### Conversation AI
**Endpoint**: `groq.chat.completions.create()`

**System Prompt**:
```typescript
{
  role: "system",
  content: `You are a helpful language learning assistant. Your name is Lingo. 
  You should be friendly and encouraging. Your goal is to help the user practice 
  a new language. You can ask questions, provide corrections, and offer explanations. 
  You should keep your responses concise and short and easy to understand. 
  The user has selected ${selectedLanguage.name} as their language of choice.`
}
```

### Speech Recognition
**Endpoint**: `https://api.groq.com/openai/v1/audio/transcriptions`

**Features**:
- Audio file upload
- Whisper model integration
- Text transcription
- Error handling

### External APIs
**Dictionary API**: `https://api.dictionaryapi.dev/api/v2/entries/en/{word}`
- Word definitions
- Phonetic transcriptions
- Audio pronunciations

## UI/UX Design System

### Color Palette
```typescript
const colors = {
  primary: "#757BFD",      // Main brand color
  secondary: "#4CAF50",    // Success/positive actions
  warning: "#faad14",      // Warning states
  error: "#ff4d4f",        // Error states
  background: "#fff",      // Main background
  surface: "#f9f9f9",      // Card backgrounds
  text: {
    primary: "#333",       // Main text
    secondary: "#666",     // Secondary text
    disabled: "#999",      // Disabled text
  }
};
```

### Typography
```typescript
const typography = {
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
  },
  caption: {
    fontSize: 14,
    fontWeight: "400",
  }
};
```

### Component Patterns
- **Cards**: Rounded corners, shadows, consistent padding
- **Buttons**: Primary/secondary styles, loading states
- **Inputs**: Consistent styling, validation states
- **Navigation**: Tab bars, stack headers, back buttons

### Responsive Design
- **Flexbox Layout**: Responsive grid systems
- **Safe Area**: Proper handling of device notches
- **Platform Differences**: iOS/Android specific styling

## Development Guidelines

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Code quality enforcement
- **Component Structure**: Functional components with hooks
- **File Naming**: PascalCase for components, camelCase for utilities

### Best Practices
1. **Component Organization**:
   ```typescript
   // Component structure
   import statements
   interface definitions
   component function
   styles definition
   export statement
   ```

2. **State Management**:
   ```typescript
   // Use appropriate hooks
   const [state, setState] = useState(initialValue);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   ```

3. **Error Handling**:
   ```typescript
   try {
     // API calls
   } catch (error) {
     setError(error.message);
   } finally {
     setLoading(false);
   }
   ```

### Performance Considerations
- **Memoization**: Use `useCallback` and `useMemo` for expensive operations
- **Image Optimization**: Proper image sizing and caching
- **Lazy Loading**: Load components and data as needed
- **Memory Management**: Cleanup effects and subscriptions

## API Documentation

### Environment Variables
```bash
EXPO_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
```

### External API Endpoints

#### Dictionary API
```
GET https://api.dictionaryapi.dev/api/v2/entries/en/{word}
```
**Response**: Word definitions, phonetics, audio URLs

#### Groq Speech-to-Text
```
POST https://api.groq.com/openai/v1/audio/transcriptions
```
**Body**: FormData with audio file and model specification

#### Groq Chat Completions
```
POST https://api.groq.com/openai/v1/chat/completions
```
**Body**: JSON with messages array and model specification

### Error Handling
```typescript
// Standard error handling pattern
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
} catch (error) {
  console.error('API Error:', error);
  setError(error.message);
}
```

## Deployment

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm start

# Platform-specific builds
npm run ios
npm run android
npm run web
```

### Build Configuration
- **Expo**: Managed workflow
- **Platforms**: iOS, Android, Web
- **Build Tools**: EAS Build (recommended)

### Environment Setup
1. **Expo CLI**: Install globally
2. **Development Tools**: Xcode (iOS), Android Studio (Android)
3. **API Keys**: Configure Groq API key in environment variables

### Production Considerations
- **API Rate Limits**: Monitor Groq API usage
- **Error Monitoring**: Implement crash reporting
- **Performance**: Optimize bundle size and loading times
- **Testing**: Unit tests for critical functions

## Future Enhancements

### Planned Features
- **Backend Integration**: User authentication and data sync
- **Offline Mode**: Cached content and offline practice
- **Social Features**: Leaderboards and friend connections
- **Advanced Analytics**: Detailed learning insights
- **Gamification**: Achievements and rewards system

### Technical Improvements
- **State Management**: Redux or Zustand for complex state
- **Testing**: Unit and integration tests
- **CI/CD**: Automated testing and deployment
- **Performance**: Bundle optimization and lazy loading

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Maintainer**: LingoSYNC Development Team
