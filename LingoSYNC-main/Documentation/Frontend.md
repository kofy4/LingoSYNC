# LingoSYNC Frontend Documentation

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Design System](#design-system)
5. [Component Architecture](#component-architecture)
6. [Navigation System](#navigation-system)
7. [State Management](#state-management)
8. [Styling Guidelines](#styling-guidelines)
9. [UI Components](#ui-components)
10. [Screen Documentation](#screen-documentation)
11. [Performance Optimization](#performance-optimization)
12. [Accessibility](#accessibility)
13. [Testing Strategy](#testing-strategy)

## Overview

The LingoSYNC frontend is built with **React Native** and **Expo**, providing a cross-platform language learning experience. The application features a modern, intuitive interface designed for optimal user engagement and learning outcomes.

### Key Design Principles
- **User-Centric**: Intuitive navigation and clear visual hierarchy
- **Accessible**: High contrast ratios and touch-friendly interfaces
- **Responsive**: Adapts to different screen sizes and orientations
- **Performance**: Optimized rendering and smooth animations

## Technology Stack

### Core Technologies
```json
{
  "react": "19.0.0",
  "react-native": "0.79.3",
  "expo": "~53.0.11",
  "typescript": "~5.8.3"
}
```

### UI & Navigation
```json
{
  "expo-router": "~5.1.0",
  "@expo/vector-icons": "^14.1.0",
  "react-native-gesture-handler": "~2.24.0",
  "react-native-reanimated": "~3.17.4",
  "react-native-safe-area-context": "5.4.0"
}
```

### Media & Interactions
```json
{
  "expo-av": "^15.1.7",
  "expo-haptics": "~14.1.4",
  "expo-image": "~2.3.0"
}
```

## Project Structure

```
app/
├── _layout.tsx                    # Root navigation layout
├── index.tsx                      # Welcome screen
├── login.tsx                      # Authentication screen
├── signup.tsx                     # Registration screen
├── language-setup.tsx             # Onboarding screen
├── profile.tsx                    # User profile screen
├── main/                          # Main app screens
│   ├── _layout.tsx               # Tab navigation
│   ├── homepage.tsx              # Dashboard
│   ├── conversation.tsx          # AI chat interface
│   └── pronunciation-practice.tsx # Speech practice
└── utils/                         # Utility functions
    ├── StorageService.ts         # Local storage
    └── string-similarity.ts      # String algorithms
```

## Design System

### Color Palette

```typescript
const colors = {
  // Primary Colors
  primary: "#757BFD",           // Main brand color
  primaryLight: "#757BFD15",    // Primary with 15% opacity
  primaryDark: "#5A5FCC",       // Darker variant
  
  // Secondary Colors
  secondary: "#4CAF50",         // Success/positive actions
  secondaryLight: "#4CAF5015",  // Secondary with 15% opacity
  
  // Semantic Colors
  success: "#52c41a",           // Success states
  warning: "#faad14",           // Warning states
  error: "#ff4d4f",             // Error states
  info: "#1890ff",              // Information states
  
  // Neutral Colors
  background: "#fff",           // Main background
  surface: "#f9f9f9",           // Card backgrounds
  border: "#eee",               // Border colors
  divider: "#e9ecef",           // Divider lines
  
  // Text Colors
  text: {
    primary: "#333",            // Main text
    secondary: "#666",          // Secondary text
    disabled: "#999",           // Disabled text
    inverse: "#fff",            // Text on dark backgrounds
  }
};
```

### Typography Scale

```typescript
const typography = {
  // Display Text
  displayLarge: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 40,
  },
  displayMedium: {
    fontSize: 28,
    fontWeight: "bold",
    lineHeight: 36,
  },
  
  // Headings
  h1: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 32,
  },
  h2: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
  },
  
  // Body Text
  bodyLarge: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
  
  // Caption Text
  caption: {
    fontSize: 11,
    fontWeight: "400",
    lineHeight: 14,
  }
};
```

### Spacing System

```typescript
const spacing = {
  xs: 4,    // Extra small
  sm: 8,    // Small
  md: 16,   // Medium
  lg: 24,   // Large
  xl: 32,   // Extra large
  xxl: 48,  // Extra extra large
};
```

### Border Radius

```typescript
const borderRadius = {
  none: 0,
  sm: 6,     // Small buttons, inputs
  md: 12,    // Cards, containers
  lg: 16,    // Large cards
  xl: 20,    // Extra large containers
  full: 50,  // Circular elements
};
```

## Component Architecture

### Component Structure Pattern

```typescript
// Standard component structure
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ComponentProps {
  // TypeScript interfaces for props
}

const ComponentName: React.FC<ComponentProps> = ({ props }) => {
  // State management
  const [state, setState] = useState(initialValue);
  
  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = () => {
    // Event logic
  };
  
  // Render methods
  const renderContent = () => {
    // Conditional rendering
  };
  
  return (
    <View style={styles.container}>
      {/* Component content */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Styles
  },
});

export default ComponentName;
```

### Common Component Patterns

#### 1. Card Component
```typescript
const Card: React.FC<CardProps> = ({ children, style, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.card, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
```

#### 2. Button Component
```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary',
  disabled = false,
  loading = false 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabled
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.buttonText, styles[`${variant}Text`]]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
```

## Navigation System

### Navigation Architecture

The app uses a hierarchical navigation structure with **Expo Router**:

```typescript
// Root Stack Navigator (app/_layout.tsx)
<Stack>
  <Stack.Screen name="index" options={{ headerShown: false }} />
  <Stack.Screen name="login" options={{ headerShown: false }} />
  <Stack.Screen name="signup" options={{ headerShown: false }} />
  <Stack.Screen name="language-setup" options={{ headerShown: false }} />
  <Stack.Screen name="profile" options={{ headerShown: false }} />
  <Stack.Screen name="main" options={{ headerShown: false }} />
</Stack>
```

### Tab Navigation (Main App)

```typescript
// Tab Navigator (app/main/_layout.tsx)
<Tabs
  screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: "#757BFD",
    tabBarInactiveTintColor: "#999",
    tabBarStyle: {
      backgroundColor: "#fff",
      borderTopWidth: 1,
      borderTopColor: "#eee",
    },
  }}
>
  <Tabs.Screen
    name="homepage"
    options={{
      title: "Home",
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="home" size={size} color={color} />
      ),
    }}
  />
  {/* Other tabs */}
</Tabs>
```

### Navigation Patterns

#### 1. Screen Transitions
```typescript
// Push navigation
router.push('/main/homepage');

// Replace navigation (no back button)
router.replace('/main/homepage');

// Go back
router.back();

// Navigate with parameters
router.push({
  pathname: '/profile',
  params: { userId: '123' }
});
```

#### 2. Modal Navigation
```typescript
// Modal implementation
const [modalVisible, setModalVisible] = useState(false);

<Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      {/* Modal content */}
    </View>
  </View>
</Modal>
```

## State Management

### Local State Patterns

#### 1. Form State Management
```typescript
const [formData, setFormData] = useState({
  email: '',
  password: '',
  confirmPassword: ''
});

const updateField = (field: string, value: string) => {
  setFormData(prev => ({
    ...prev,
    [field]: value
  }));
};
```

#### 2. Loading States
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleSubmit = async () => {
  setLoading(true);
  setError(null);
  
  try {
    // API call
    await submitForm(formData);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

#### 3. List State Management
```typescript
const [items, setItems] = useState<Item[]>([]);
const [selectedItems, setSelectedItems] = useState<string[]>([]);

const toggleItem = (itemId: string) => {
  setSelectedItems(prev => 
    prev.includes(itemId)
      ? prev.filter(id => id !== itemId)
      : [...prev, itemId]
  );
};
```

### Persistent Storage

```typescript
// StorageService usage
const [userStats, setUserStats] = useState({
  streak: 0,
  hoursPracticed: 0,
  wordsLearned: 0
});

useEffect(() => {
  const loadStats = async () => {
    const streak = await StorageService.getStreak();
    const hours = await StorageService.getHoursPracticed();
    const words = await StorageService.getLearnedWords();
    
    setUserStats({
      streak,
      hoursPracticed: hours,
      wordsLearned: words.length
    });
  };
  
  loadStats();
}, []);
```

## Styling Guidelines

### StyleSheet Best Practices

#### 1. Consistent Naming
```typescript
const styles = StyleSheet.create({
  // Container styles
  container: { /* ... */ },
  contentContainer: { /* ... */ },
  
  // Header styles
  header: { /* ... */ },
  headerTitle: { /* ... */ },
  headerButton: { /* ... */ },
  
  // Card styles
  card: { /* ... */ },
  cardTitle: { /* ... */ },
  cardContent: { /* ... */ },
  
  // Button styles
  button: { /* ... */ },
  buttonPrimary: { /* ... */ },
  buttonSecondary: { /* ... */ },
});
```

#### 2. Responsive Design
```typescript
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width - 32, // Account for margins
    paddingHorizontal: 16,
  },
  card: {
    width: width * 0.45, // Percentage-based sizing
    minHeight: height * 0.2,
  },
});
```

#### 3. Platform-Specific Styling
```typescript
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  button: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
```

### Theme System

```typescript
// Theme configuration
const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 5,
    },
  },
};
```

## UI Components

### Core Components

#### 1. Custom Button
```typescript
interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[size],
        disabled && styles.disabled
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#757BFD' : '#fff'} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={20} color={variant === 'outline' ? '#757BFD' : '#fff'} />}
          <Text style={[styles.buttonText, styles[`${variant}Text`]]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};
```

#### 2. Progress Card
```typescript
interface ProgressCardProps {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  icon,
  label,
  value,
  color = '#757BFD'
}) => {
  return (
    <View style={styles.progressCard}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={styles.progressLabel}>{label}</Text>
      <Text style={styles.progressValue}>{value}</Text>
    </View>
  );
};
```

#### 3. Language Card
```typescript
interface LanguageCardProps {
  language: {
    id: string;
    name: string;
    icon: string;
    isNew?: boolean;
  };
  selected: boolean;
  onPress: () => void;
}

const LanguageCard: React.FC<LanguageCardProps> = ({
  language,
  selected,
  onPress
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.languageCard,
        selected && styles.languageCardSelected
      ]}
      onPress={onPress}
    >
      <View style={styles.languageIconContainer}>
        <Ionicons
          name={language.icon}
          size={32}
          color={selected ? '#757BFD' : '#666'}
        />
        {language.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>New</Text>
          </View>
        )}
      </View>
      <Text style={[
        styles.languageName,
        selected && styles.languageNameSelected
      ]}>
        {language.name}
      </Text>
    </TouchableOpacity>
  );
};
```

### Form Components

#### 1. Custom Input
```typescript
interface CustomInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  disabled?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  disabled = false
}) => {
  return (
    <View style={styles.inputContainer}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          disabled && styles.inputDisabled
        ]}
        placeholder={placeholder}
        placeholderTextColor="#bbb"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        editable={!disabled}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
```

## Screen Documentation

### 1. Welcome Screen (index.tsx)

**Purpose**: Landing page with app introduction and call-to-action

**Key Components**:
- App logo and branding
- Hero image
- "Get Started" button
- Clean, minimal design

**Layout Structure**:
```typescript
<SafeAreaView>
  <Text>LingoSYNC</Text>
  <Text>Unlock New Worlds</Text>
  <Text>Learn languages, connect with cultures.</Text>
  <Image source={homeImage} />
  <TouchableOpacity onPress={() => router.push("/signup")}>
    <Text>Get Started</Text>
  </TouchableOpacity>
</SafeAreaView>
```

### 2. Authentication Screens (login.tsx, signup.tsx)

**Purpose**: User authentication and account creation

**Key Features**:
- Form validation
- Social login options
- Navigation between auth screens
- Error handling

**Form Structure**:
```typescript
<View style={styles.form}>
  <CustomInput
    label="Email"
    placeholder="Enter your email"
    value={email}
    onChangeText={setEmail}
  />
  <CustomInput
    label="Password"
    placeholder="Enter your password"
    value={password}
    onChangeText={setPassword}
    secureTextEntry
  />
  <CustomButton
    title="Login"
    onPress={handleLogin}
    loading={loading}
  />
</View>
```

### 3. Language Setup Screen (language-setup.tsx)

**Purpose**: Onboarding flow for language selection

**Key Features**:
- Multi-language selection grid
- Visual language cards
- Selected languages display
- Skip/Continue navigation

**Grid Layout**:
```typescript
<View style={styles.languagesGrid}>
  {languages.map((language) => (
    <LanguageCard
      key={language.id}
      language={language}
      selected={selectedLanguages.includes(language.id)}
      onPress={() => handleLanguageSelect(language.id)}
    />
  ))}
</View>
```

### 4. Dashboard Screen (homepage.tsx)

**Purpose**: Main app dashboard with progress tracking

**Key Sections**:
- Progress cards (streak, hours, words)
- Proficiency level selection
- Quick access cards
- Statistics overview

**Progress Tracking**:
```typescript
<View style={styles.progressContainer}>
  <ProgressCard
    icon="flame"
    label="Streak"
    value={`${stats.streak} Day(s)`}
    color="#FFD700"
  />
  <ProgressCard
    icon="time"
    label="Hours Practiced"
    value={stats.hoursPracticed.toFixed(1)}
    color="#757BFD"
  />
  <ProgressCard
    icon="book"
    label="Words Learned"
    value={stats.wordsLearned}
    color="#4CAF50"
  />
</View>
```

### 5. Conversation Screen (conversation.tsx)

**Purpose**: AI-powered language conversation practice

**Key Features**:
- Real-time chat interface
- Language selection modal
- Typing indicators
- Message timestamps

**Chat Interface**:
```typescript
<KeyboardAvoidingView style={styles.chatContainer}>
  <ScrollView ref={scrollViewRef}>
    {messages.map(renderMessage)}
    {isTyping && renderTypingIndicator()}
  </ScrollView>
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.textInput}
      value={inputText}
      onChangeText={setInputText}
      placeholder="Type your message..."
    />
    <TouchableOpacity onPress={sendMessage}>
      <Ionicons name="send" size={20} color="#fff" />
    </TouchableOpacity>
  </View>
</KeyboardAvoidingView>
```

### 6. Pronunciation Practice Screen (pronunciation-practice.tsx)

**Purpose**: Speech practice with audio recording and scoring

**Key Features**:
- Word selection chips
- Audio recording interface
- Pronunciation scoring
- Audio playback

**Recording Interface**:
```typescript
<TouchableOpacity
  style={[
    styles.recordButton,
    isRecording && styles.recordButtonRecording
  ]}
  onPress={handleRecord}
>
  <Ionicons
    name={isRecording ? "stop-circle" : "mic-circle"}
    size={64}
    color="#fff"
  />
</TouchableOpacity>
```

## Performance Optimization

### 1. Component Optimization

#### Memoization
```typescript
// Memoize expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <View>{/* Component content */}</View>;
});

// Memoize callbacks
const handlePress = useCallback(() => {
  // Handle press logic
}, [dependencies]);

// Memoize computed values
const processedData = useMemo(() => {
  return data.map(item => ({ ...item, processed: true }));
}, [data]);
```

#### List Optimization
```typescript
// FlatList for large lists
<FlatList
  data={items}
  renderItem={({ item }) => <ListItem item={item} />}
  keyExtractor={(item) => item.id}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
/>
```

### 2. Image Optimization

```typescript
// Use expo-image for better performance
import { Image } from 'expo-image';

<Image
  source={require('../assets/images/icon.png')}
  style={styles.image}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
/>
```

### 3. Bundle Optimization

```typescript
// Lazy load components
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// Dynamic imports
const loadFeature = async () => {
  const { default: Feature } = await import('./Feature');
  return Feature;
};
```

## Accessibility

### 1. Accessibility Props

```typescript
// Screen reader support
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Login button"
  accessibilityHint="Double tap to login"
  accessibilityRole="button"
  onPress={handleLogin}
>
  <Text>Login</Text>
</TouchableOpacity>

// Input accessibility
<TextInput
  accessible={true}
  accessibilityLabel="Email input field"
  accessibilityHint="Enter your email address"
  placeholder="Email"
/>
```

### 2. Color Contrast

```typescript
// Ensure sufficient contrast ratios
const styles = StyleSheet.create({
  text: {
    color: '#333', // Dark text on light background
  },
  button: {
    backgroundColor: '#757BFD', // High contrast primary color
  },
});
```

### 3. Touch Targets

```typescript
// Minimum 44x44 points for touch targets
const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    minWidth: 44,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
```

## Testing Strategy

### 1. Component Testing

```typescript
// Example test structure
import { render, fireEvent } from '@testing-library/react-native';
import CustomButton from '../CustomButton';

describe('CustomButton', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <CustomButton title="Test Button" onPress={() => {}} />
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <CustomButton title="Test Button" onPress={onPress} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### 2. Screen Testing

```typescript
// Screen integration tests
describe('LoginScreen', () => {
  it('validates form inputs', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    
    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.changeText(passwordInput, '123');
    
    fireEvent.press(getByText('Login'));
    
    expect(getByText('Please enter a valid email')).toBeTruthy();
  });
});
```

### 3. Navigation Testing

```typescript
// Navigation testing
import { useRouter } from 'expo-router';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('Navigation', () => {
  it('navigates to signup on button press', () => {
    const mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    
    const { getByText } = render(<WelcomeScreen />);
    fireEvent.press(getByText('Get Started'));
    
    expect(mockRouter.push).toHaveBeenCalledWith('/signup');
  });
});
```

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Frontend Team**: LingoSYNC Development
