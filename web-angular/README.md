# Schedular - Advanced Event Management System

An educational Angular application demonstrating modern web development practices with a comprehensive event management system featuring calendar views, recurring events, notifications, participants management, and theme switching.

## 🎯 **Standalone Design Philosophy**

### 🚀 **Client-Side First, Backend Optional**

This Angular application is **intentionally designed** as a **complete standalone solution** that:

- ✅ **Runs 100% in the browser** - no server required!
- ✅ **Uses localStorage** for persistence - your data stays with you
- ✅ **Deploys instantly** to any static hosting service 
- ✅ **Works offline** once loaded - perfect for PWA conversion
- ✅ **Copy-paste friendly** - grab what you need for your projects

### 🎓 **Educational & Production Ready**

This isn't a toy app or incomplete demo - it's a **fully functional calendar application** with:
- 📋 **Complete event management** (CRUD operations)
- 🔄 **Complex recurring events** with custom patterns
- 👥 **Participant management** with status tracking
- 🎨 **Theme switching** and responsive design
- 🔔 **Browser notifications** and rich interactions
- 📱 **Mobile-first responsive** design

**Best part?** Every feature is implemented using **vanilla Angular patterns** with **comprehensive comments** explaining the how and why!

## 📋 Table of Contents
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Feature Documentation](#-feature-documentation)
- [API Integration Points](#-api-integration-points)
- [Component Architecture](#-component-architecture)
- [Services Documentation](#-services-documentation)
- [Styling & Theming](#-styling--theming)
- [Educational Resources](#-educational-resources)

## 🚀 Features

### Core Calendar Features
- **Multiple Calendar Views**: Month, Week, and Day views using FullCalendar
- **Event Management**: Create, edit, delete, and view events with rich details
- **Mini Calendar**: Sidebar mini calendar with event indicators and navigation
- **Drag & Drop**: Move and resize events directly on the calendar

### Advanced Event Features
- **Recurring Events**: Daily, weekly, monthly, yearly with custom patterns
- **Event Categories**: Color-coded categories with visibility toggles
- **Participants Management**: Add participants with status tracking
- **Notifications**: Browser notifications with customizable timing
- **Event Details**: Comprehensive event information display

### User Experience
- **Dark/Light Theme**: Complete theme switching with smooth transitions
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Form Validation**: Real-time validation with user-friendly error messages
- **Search & Filter**: Search participants and filter events by category

### 💾 **Data Persistence Strategy**

**Why localStorage?** Because it's:
- 🚀 **Instant** - no network calls, no loading spinners
- 🔒 **Private** - your data never leaves your device
- 📱 **Offline-ready** - works without internet connection
- 🎯 **Simple** - no complex state management needed
- 🔄 **Reliable** - no server downtime concerns

**All data persists** across browser sessions, including:
- Events and their details
- Category preferences
- Theme settings  
- Participant data
- Notification preferences

## 🛠 Technology Stack

- **Framework**: Angular 18+ (Standalone Components)
- **Calendar UI**: FullCalendar (lightweight, feature-rich)
- **Styling**: Tailwind CSS (utility-first, no bloat)
- **Icons**: Heroicons via SVG (no icon fonts needed)
- **State Management**: RxJS Observables with Services (Angular's native power)
- **Data Storage**: Browser LocalStorage (client-side persistence)
- **Build Tool**: Angular CLI with Vite (modern, fast builds)

**Dependencies Count**: **Minimal!** Only what's essential for functionality.

## 📁 Project Structure

```
web-angular/                         # 🎯 Standalone Angular Application
├── src/app/
│   ├── components/
│   │   └── calendar/                # 📅 Main calendar module
│   │       ├── calendar.component.* # 🎛️ Main container (1500+ lines of education!)
│   │       ├── mini-calendar/       # 📋 Sidebar mini calendar
│   │       ├── main-calendar/       # [Future] Separated main view
│   │       ├── event-modal/         # [Future] Dedicated modal component
│   │       ├── category-management/ # [Future] Category management UI
│   │       └── shared/              # 🧩 Reusable components
│   │           ├── time-input/      # ⏰ Custom time picker
│   │           ├── participants-selector/ # 👥 Participant selection
│   │           ├── date-input/      # [Future] Date picker
│   │           ├── notification-settings/ # [Future] Notification UI
│   │           └── recurrence-settings/ # [Future] Recurrence config
│   ├── services/                    # 🔧 Business logic (100% documented!)
│   │   ├── category.service.ts      # 🏷️ Category management with localStorage
│   │   ├── notification.service.ts  # 🔔 Browser notifications
│   │   ├── participants.service.ts  # 👥 Participant management  
│   │   ├── recurrence.service.ts    # 🔄 Recurring event logic
│   │   └── theme.service.ts         # 🎨 Theme switching
│   ├── models/                      # 📋 TypeScript interfaces (learning gold!)
│   │   └── calendar.models.ts       # 🎯 All data models with examples
│   ├── app.ts                       # 🏠 Root component
│   ├── app.html                     # 📄 Root template
│   └── styles.css                   # 🎨 Global styles
└── dist/                            # 📦 Build output (ready for deployment!)
```

## 🏗 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Modern web browser with ES6+ support

### ⚡ **Super Quick Start**

```bash
# 1. Clone and navigate
git clone [repository-url]
cd Schedular/web-angular

# 2. Install minimal dependencies
npm install

# 3. Launch the app
ng serve

# 4. Open http://localhost:4200
# 🎉 That's it! Full calendar app running!
```

### 🚀 **Production Build**

```bash
# Build for production (optimized, minified)
ng build --prod

# Deploy the dist/ folder anywhere:
# ✅ GitHub Pages
# ✅ Netlify
# ✅ Vercel  
# ✅ Firebase Hosting
# ✅ Any static hosting service
```

**Result**: Static files that run anywhere without any server setup!

## 📖 Feature Documentation

### 1. Calendar Views (`calendar.component.ts`)
**Location**: `src/app/components/calendar/calendar.component.ts`

**Key Methods**:
- `initializeCalendar()`: Sets up FullCalendar with plugins and configuration
- `changeView(view)`: Switches between month/week/day views
- `navigateToDate(date)`: Jumps to specific date
- `handleEventClick()`: Opens event details modal

**Educational Notes**:
- Demonstrates FullCalendar integration with Angular
- Shows proper cleanup in `ngOnDestroy()`
- Uses ViewChild for DOM element access

### 2. Event Management
**Location**: `calendar.component.ts` (lines 950-1200)

**Key Features**:
- **Create Event**: `createEvent()` method with form validation
- **Edit Event**: `editSelectedEvent()` with recurring event handling  
- **Delete Event**: `deleteSelectedEvent()` with confirmation
- **Event Details**: Modal display with all event information

**Educational Notes**:
- Form validation patterns
- Modal state management
- Date/time handling in Angular

### 3. Recurring Events (`recurrence.service.ts`)
**Location**: `src/app/services/recurrence.service.ts`

**Key Methods**:
- `generateRecurringEvents()`: Creates event instances based on recurrence rules
- `getRecurrencePresets()`: Provides common recurrence patterns
- `getRecurrenceDescription()`: Human-readable recurrence text

**Educational Notes**:
- Complex date calculations
- Service-based business logic
- TypeScript interface usage

### 4. Category Management (`category.service.ts`)
**Location**: `src/app/services/category.service.ts`

**Key Features**:
- **CRUD Operations**: Add, edit, delete categories
- **Visibility Toggle**: Show/hide events by category
- **Color Management**: Category color schemes

**Educational Notes**:
- RxJS Subject for state management
- Local storage integration
- Observable patterns

### 5. Participants System (`participants.service.ts`)
**Location**: `src/app/services/participants.service.ts`

**Key Features**:
- **Participant Management**: Add/remove participants
- **Search Functionality**: Real-time participant search
- **Status Tracking**: Accepted, declined, pending, maybe
- **Department Filtering**: Group participants by department

**Educational Notes**:
- Array manipulation methods
- Search implementation
- Data filtering patterns

### 6. Notification System (`notification.service.ts`)
**Location**: `src/app/services/notification.service.ts`

**Key Features**:
- **Browser Notifications**: Native notification API
- **Permission Management**: Request and track permissions
- **Scheduled Notifications**: Time-based notification scheduling
- **Multiple Notification Types**: Different timing options

**Educational Notes**:
- Browser API integration
- Permission handling
- Asynchronous operations

### 7. Theme System (`theme.service.ts`)
**Location**: `src/app/services/theme.service.ts`

**Key Features**:
- **Dark/Light Toggle**: Complete theme switching
- **CSS Variable Management**: Dynamic style updates
- **Persistent Settings**: Theme preference storage

**Educational Notes**:
- CSS custom properties manipulation
- Service persistence patterns
- Observable state management

### 8. Mini Calendar (`mini-calendar.component.ts`)
**Location**: `src/app/components/calendar/mini-calendar/`

**Key Features**:
- **Month Navigation**: Previous/next month controls
- **Date Selection**: Click to select dates
- **Event Indicators**: Visual event count display
- **Today Highlighting**: Current date emphasis

**Educational Notes**:
- Component communication (Input/Output)
- Date calculation algorithms
- Reusable component design

## 🔌 API Integration Points

### 🎯 **Future-Proofing Design**

While this app runs completely **without** a backend, we've marked every place where you **could** integrate APIs:

**Search for**: `REPLACE_WITH_API` comments throughout the codebase

### Standard API Comment Format
```typescript
// TODO: REPLACE_WITH_API - [Description of what API call should do]
// Current: Using localStorage
// Future: HTTP request to backend endpoint
```

### Key API Integration Areas

1. **Event Management** (`calendar.component.ts`)
```typescript
// TODO: REPLACE_WITH_API - Save new event to backend
// Current: Adding to local events array
// Future: POST /api/events
```

2. **Category Management** (`category.service.ts`)
```typescript
// TODO: REPLACE_WITH_API - Fetch categories from backend
// Current: Using localStorage with default categories
// Future: GET /api/categories
```

3. **Participants Management** (`participants.service.ts`)
```typescript
// TODO: REPLACE_WITH_API - Load participants from backend
// Current: Using hardcoded participant list
// Future: GET /api/participants
```

4. **Authentication** (Not yet implemented)
```typescript
// TODO: REPLACE_WITH_API - User authentication
// Current: No authentication
// Future: POST /api/auth/login
```

**Benefits of This Approach**:
- 🚀 **Ship now** with localStorage
- 🔄 **Upgrade later** to full backend
- 📖 **Learn gradually** - no overwhelming complexity
- 🎯 **Choose your backend** - not locked into any specific technology

## 🏛 Component Architecture

### Design Patterns Used

1. **Container/Presenter Pattern**: Main calendar component as container, child components as presenters
2. **Service Layer**: Business logic separated into injectable services
3. **Observable Data Flow**: RxJS for reactive programming
4. **Standalone Components**: Modern Angular architecture without NgModules

### Component Communication

- **Parent to Child**: `@Input()` properties
- **Child to Parent**: `@Output()` events with `EventEmitter`
- **Service Communication**: Shared services with observables
- **State Management**: Services hold state, components subscribe

### Reusable Components

- **Time Input** (`shared/time-input/`): Reusable time picker with validation
- **Participants Selector** (`shared/participants-selector/`): Reusable participant selection
- **Mini Calendar** (`mini-calendar/`): Standalone calendar widget

## 🎯 Services Documentation

### CategoryService
- **Purpose**: Manage event categories and visibility
- **Key Methods**: `addCategory()`, `deleteCategory()`, `toggleVisibility()`
- **Storage**: Local storage with `categories` key

### NotificationService  
- **Purpose**: Handle browser notifications for events
- **Key Methods**: `requestPermission()`, `scheduleNotification()`
- **Dependencies**: Browser Notification API

### ParticipantsService
- **Purpose**: Manage event participants and search
- **Key Methods**: `searchParticipants()`, `getParticipantsByDepartment()`
- **Storage**: Hardcoded participant list (demonstrates data patterns)

### RecurrenceService
- **Purpose**: Generate recurring event instances
- **Key Methods**: `generateRecurringEvents()`, `getRecurrencePresets()`
- **Complex Logic**: Date calculations and rule processing

### ThemeService
- **Purpose**: Handle dark/light theme switching
- **Key Methods**: `toggleTheme()`, `setTheme()`
- **Storage**: Local storage with `theme` key

## 🎨 Styling & Theming

### CSS Architecture
- **Tailwind CSS**: Utility-first CSS framework
- **CSS Custom Properties**: For theme variables
- **Component Styles**: Scoped styles per component
- **Global Styles**: App-wide styling in `styles.css`

### Theme Implementation
```css
:root {
  --color-primary: #dcff00;
  --color-secondary: #5cffe4;
  --color-surface: #ffffff;
  --color-text-primary: #1f2937;
}

[data-theme="dark"] {
  --color-surface: #1f2937;
  --color-text-primary: #f9fafb;
}
```

### Responsive Design
- **Mobile First**: Tailwind's responsive approach
- **Breakpoints**: sm, md, lg, xl for different screen sizes
- **Touch Friendly**: Larger touch targets on mobile

## 📚 Educational Resources

### Key Learning Concepts

1. **Angular Standalone Components**: Modern Angular architecture
2. **RxJS Observables**: Reactive programming patterns
3. **TypeScript Interfaces**: Strong typing and data modeling
4. **Local Storage**: Browser storage APIs
5. **CSS Custom Properties**: Dynamic styling
6. **FullCalendar Integration**: Third-party library integration
7. **Form Validation**: Real-time validation patterns
8. **Component Communication**: Parent-child data flow

### Code Examples to Study

1. **Service Injection**: How services are injected and used
2. **Observable Patterns**: Subscribe/unsubscribe lifecycle
3. **Event Handling**: DOM event management
4. **Date Manipulation**: Working with JavaScript dates
5. **Array Operations**: Filtering, mapping, reducing data
6. **Conditional Rendering**: Angular structural directives
7. **Form Binding**: Two-way data binding patterns

### Best Practices Demonstrated

- **Separation of Concerns**: Services for logic, components for presentation
- **Memory Management**: Proper subscription cleanup
- **Type Safety**: Full TypeScript type coverage
- **Error Handling**: Graceful error management
- **User Experience**: Loading states and feedback
- **Accessibility**: Semantic HTML and ARIA attributes
- **Performance**: OnPush change detection where applicable

## 🔍 Quick Search Guide

Use these terms to quickly find specific functionality:

- `REPLACE_WITH_API`: API integration points
- `TODO:`: Areas for improvement or future development
- `@Input()` / `@Output()`: Component communication
- `subscribe()`: RxJS observable usage
- `localStorage`: Local storage usage
- `generateRecurring`: Recurring event logic
- `handleEvent`: Event handling methods
- `toggle`: Toggle functionality (theme, visibility, etc.)

## 🚦 Development Commands

```bash
# Development server
ng serve

# Build for production (static files ready for deployment!)
ng build --prod

# Run tests
ng test

# Generate component (with educational comments!)
ng generate component component-name

# Generate service (with educational structure!)
ng generate service service-name

# Lint code
ng lint

# Format code (if prettier configured)
npm run format
```

## 🚀 **Deployment Guide**

### **Static Hosting (Recommended)**

Since this is a complete client-side app:

```bash
# Build for production
ng build --prod

# Deploy dist/ folder to any of these:
```

**✅ GitHub Pages**
```bash
# After building, push dist/ contents to gh-pages branch
```

**✅ Netlify**
```bash
# Drag and drop dist/ folder to Netlify dashboard
# Or connect your repo for automatic deployments
```

**✅ Vercel**
```bash
npm install -g vercel
vercel --prod
```

**✅ Firebase Hosting**
```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

### **PWA Conversion** (Bonus!)

Turn this into a Progressive Web App:

```bash
ng add @angular/pwa
ng build --prod
```

Now your calendar app:
- 📱 **Installs like a native app**
- 🔒 **Works offline** 
- 🚀 **Loads instantly** with service worker caching

## 📄 License

This project is for educational purposes. Feel free to use, modify, and distribute for learning and teaching purposes.

---

## 🎉 **Ready to Build Amazing Calendar Apps?**

This isn't just a demo - it's a **complete, production-ready** calendar solution that:

- 🚀 **Ships immediately** without backend complexity
- 📖 **Teaches you** modern Angular development
- 🔧 **Adapts easily** to your specific needs
- 📈 **Scales up** when you're ready for more

**No more hunting for packages. No more fighting with dependencies. Just pure, educational, production-ready code.**

**Happy Learning & Building! 🎓**
