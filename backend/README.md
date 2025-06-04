# Schedular Backend API

A comprehensive NestJS backend API for the Schedular event management system. This API provides full CRUD operations for events, categories, participants, and supports advanced features like recurring events, notifications, and complex filtering.

## 🚀 **Features**

### **Core Functionality**
- ✅ **Event Management**: Full CRUD with recurring events support
- ✅ **Category System**: Color-coded event categorization
- ✅ **Participant Management**: User invitation and status tracking
- ✅ **Notification System**: Event reminders and alerts
- ✅ **Advanced Search**: Full-text search across events and participants
- ✅ **Date Filtering**: Range-based event queries
- ✅ **Recurring Events**: Complex recurrence patterns with exclusions

### **Technical Features**
- ✅ **TypeORM Integration**: PostgreSQL database with auto-migrations
- ✅ **Validation**: Comprehensive DTO validation with class-validator
- ✅ **CORS Support**: Frontend integration ready
- ✅ **Error Handling**: Structured error responses
- ✅ **UUID Primary Keys**: Secure, non-sequential identifiers
- ✅ **Relationship Management**: Proper foreign key constraints

## 🛠️ **Technology Stack**

- **Framework**: NestJS 11+ (Node.js/TypeScript)
- **Database**: PostgreSQL with TypeORM
- **Validation**: class-validator & class-transformer
- **Architecture**: Modular service-controller pattern
- **API Style**: RESTful with resource-based endpoints

## 📋 **Prerequisites**

- Node.js 18+ and npm
- PostgreSQL 12+ database
- Git for version control

## 🚀 **Quick Start**

### **1. Clone and Install**
```bash
git clone <repository-url>
cd backend
npm install
```

### **2. Database Setup**
```bash
# Create PostgreSQL database
createdb schedular

# Or using psql
psql -U postgres -c "CREATE DATABASE schedular;"
```

### **3. Environment Configuration**
Create a `.env` file in the backend root:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=schedular

# Application Configuration
NODE_ENV=development
PORT=3000

# CORS Configuration
CORS_ORIGIN=http://localhost:4200
```

### **4. Start Development Server**
```bash
# Development mode with auto-reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at: `http://localhost:3000`

## 📚 **API Documentation**

### **Base URL**: `http://localhost:3000/api`

### **Events API** (`/api/events`)

#### **Create Event**
```http
POST /api/events
Content-Type: application/json

{
  "title": "Team Meeting",
  "description": "Weekly team sync",
  "startDate": "2024-01-15T10:00:00Z",
  "endDate": "2024-01-15T11:00:00Z",
  "allDay": false,
  "color": "#3498db",
  "textColor": "#ffffff",
  "location": "Conference Room A",
  "categoryId": "uuid-here",
  "participantIds": ["uuid1", "uuid2"],
  "recurrence": {
    "frequency": "weekly",
    "interval": 1,
    "daysOfWeek": [1, 3, 5],
    "endDate": "2024-12-31T23:59:59Z"
  },
  "notifications": [
    {
      "type": "popup",
      "timing": 15,
      "message": "Meeting starts in 15 minutes"
    }
  ]
}
```

#### **Get Events with Filtering**
```http
GET /api/events?startDate=2024-01-01&endDate=2024-12-31&categoryIds=uuid1,uuid2&includeRecurring=true
```

#### **Search Events**
```http
GET /api/events/search?q=meeting
```

#### **Get Recurring Instances**
```http
GET /api/events/{eventId}/instances?startDate=2024-01-01&endDate=2024-01-31
```

#### **Add Exclusion Date**
```http
POST /api/events/{eventId}/exclude
Content-Type: application/json

{
  "date": "2024-01-15"
}
```

#### **Update Event**
```http
PATCH /api/events/{eventId}
Content-Type: application/json

{
  "title": "Updated Meeting Title",
  "startDate": "2024-01-15T14:00:00Z"
}
```

#### **Delete Event**
```http
DELETE /api/events/{eventId}
```

### **Categories API** (`/api/categories`)

#### **Create Category**
```http
POST /api/categories
Content-Type: application/json

{
  "name": "Work",
  "color": "#3498db",
  "icon": "💼",
  "isVisible": true,
  "description": "Work-related events"
}
```

#### **Get Categories**
```http
GET /api/categories?visible=true
```

#### **Create Default Categories**
```http
POST /api/categories/defaults
```

#### **Toggle Visibility**
```http
PATCH /api/categories/{categoryId}/toggle-visibility
```

### **Participants API** (`/api/participants`)

#### **Create Participant**
```http
POST /api/participants
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@company.com",
  "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  "role": "Developer",
  "department": "Engineering",
  "status": "accepted"
}
```

#### **Get Participants**
```http
GET /api/participants
```

#### **Search Participants**
```http
GET /api/participants/search?q=john
```

#### **Get Departments**
```http
GET /api/participants/departments
```

#### **Get Statistics**
```http
GET /api/participants/statistics
```

#### **Update Status**
```http
PATCH /api/participants/{participantId}/status
Content-Type: application/json

{
  "status": "accepted"
}
```

## 🗄️ **Database Schema**

### **Core Entities**

#### **Events**
- `id` (UUID, Primary Key)
- `title` (String, Required)
- `description` (Text, Optional)
- `startDate` (Timestamp, Required)
- `endDate` (Timestamp, Optional)
- `allDay` (Boolean, Default: false)
- `color` (String, Hex color)
- `textColor` (String, Hex color)
- `location` (String, Optional)
- `isRecurring` (Boolean, Default: false)
- `parentEventId` (UUID, Optional)
- `excludedDates` (String Array, Optional)
- `categoryId` (UUID, Foreign Key, Optional)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

#### **Categories**
- `id` (UUID, Primary Key)
- `name` (String, Required)
- `color` (String, Hex color)
- `icon` (String, Emoji/Icon)
- `isVisible` (Boolean, Default: true)
- `description` (Text, Optional)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

#### **Participants**
- `id` (UUID, Primary Key)
- `name` (String, Required)
- `email` (String, Unique, Required)
- `avatar` (String, URL)
- `role` (String, Optional)
- `department` (String, Optional)
- `status` (Enum: accepted, declined, pending, maybe)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

#### **Recurrence Rules**
- `id` (UUID, Primary Key)
- `frequency` (Enum: daily, weekly, monthly, yearly)
- `interval` (Integer, Default: 1)
- `daysOfWeek` (Integer Array, Optional)
- `dayOfMonth` (Integer, Optional)
- `monthOfYear` (Integer, Optional)
- `endDate` (Timestamp, Optional)
- `count` (Integer, Optional)

#### **Event Notifications**
- `id` (UUID, Primary Key)
- `type` (Enum: popup, email, push)
- `timing` (Integer, Minutes before event)
- `message` (Text, Required)
- `isEnabled` (Boolean, Default: true)
- `eventId` (UUID, Foreign Key)

### **Relationships**
- Events ↔ Categories (Many-to-One)
- Events ↔ Participants (Many-to-Many)
- Events ↔ Notifications (One-to-Many)
- Events ↔ Recurrence Rules (Many-to-One)

## 🔧 **Development Commands**

```bash
# Development
npm run start:dev          # Start with auto-reload
npm run start:debug        # Start with debugging

# Building
npm run build              # Build for production
npm run start:prod         # Start production build

# Testing
npm run test               # Run unit tests
npm run test:e2e           # Run end-to-end tests
npm run test:cov           # Run tests with coverage

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

## 🌟 **Key Features Explained**

### **Recurring Events**
The API supports complex recurring patterns:
- **Daily**: Every N days, specific days of week
- **Weekly**: Every N weeks, specific days
- **Monthly**: Every N months, specific day of month
- **Yearly**: Every N years, specific month/day
- **Exclusions**: Skip specific dates in the pattern
- **End Conditions**: End date or occurrence count

### **Advanced Filtering**
Events can be filtered by:
- Date ranges (startDate/endDate)
- Categories (multiple category IDs)
- Recurring vs non-recurring events
- Full-text search in title/description

### **Participant Management**
- Status tracking (accepted, declined, pending, maybe)
- Department-based organization
- Email uniqueness validation
- Bulk operations support

### **Validation & Error Handling**
- Comprehensive DTO validation
- Structured error responses
- Type-safe database operations
- Automatic data transformation

## 🔗 **Integration with Frontend**

This backend is designed to work seamlessly with the Angular frontend:

1. **CORS Configuration**: Pre-configured for `http://localhost:4200`
2. **API Endpoints**: Match the frontend service expectations
3. **Data Models**: Mirror the frontend TypeScript interfaces
4. **Error Handling**: Consistent error response format

### **Frontend Integration Points**
- Replace `localStorage` calls with HTTP requests
- Update service methods to use API endpoints
- Handle async operations with observables
- Implement error handling for network requests

## 📝 **Environment Variables**

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `DB_NAME` | Database name | `schedular` |
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:4200` |

## 🚀 **Production Deployment**

### **Environment Setup**
1. Set `NODE_ENV=production`
2. Configure production database credentials
3. Set secure CORS origins
4. Enable SSL/HTTPS

### **Database Migration**
```bash
# Production database setup
npm run build
NODE_ENV=production npm run start:prod
```

### **Docker Support**
```bash
# Build and run with Docker
docker-compose up -d
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 **License**

This project is part of the Schedular educational application suite.
