# Schedular - Advanced Event Management System

A comprehensive calendar and event management application built with modern web technologies. This project serves as both a functional application and an educational resource demonstrating best practices in full-stack development.

## 🌐 **Live Demo**

**[🚀 Try the Live Demo](https://fivex-schedular.web.app/)** - Experience all features in action!

## 🎯 **Why This Project is Different** 

### 🚀 **No Package Hunting, No Complex Dependencies!**

Tired of scouring the internet for the "perfect" scheduling library only to find:
- 🤯 Overcomplicated packages with 50+ dependencies?
- 💸 Expensive premium components that break your budget?
- 📚 Documentation longer than a novel?
- 🔒 Vendor lock-in with proprietary APIs?

**Stop searching. Start building.** This project gives you:

✅ **Complete scheduling system** - Copy, paste, customize, done!  
✅ **Minimal dependencies** - Just FullCalendar + Tailwind CSS  
✅ **Vanilla TypeScript/Angular** - No mysterious black boxes  
✅ **Educational comments** - Learn while you build  
✅ **Production-ready** - Deploy anywhere, anytime  

*Built with ❤️ by [Fivex Labs](https://fivexlabs.com) - We believe in sharing knowledge and empowering developers. Because when we share, we all grow stronger together.*  

### 🎓 **Educational Gold Mine**

Every line of code is documented with:
- 🧠 **Why** decisions were made
- 🔧 **How** features work under the hood  
- 📖 **What** patterns are being demonstrated
- 🚀 **Where** to extend functionality

## 🏗️ **Unique Architecture Design**

### 🎯 **Frontend: Standalone & Self-Sufficient**
- **Zero API dependencies** - Works 100% offline
- **localStorage persistence** - Your data stays with you
- **Instant deployment** - Any static hosting service
- **Educational focus** - Perfect for learning Angular

### 🔧 **Backend: Optional but Complete**
- **Full REST API** - Every feature the frontend uses
- **Educational reference** - See how to build real APIs
- **Production ready** - PostgreSQL + NestJS + TypeORM
- **Easy integration** - Drop-in replacement for localStorage

## 🚀 **Project Overview**

Schedular is a feature-rich calendar application that includes:

- **Full Calendar Integration**: Multiple view types (month, week, day)
- **Event Management**: Create, edit, delete events with rich details
- **Recurring Events**: Complex recurrence patterns and rules
- **Participants System**: Invite participants with status tracking
- **Categories & Filtering**: Organize events with color-coded categories
- **Notifications**: Browser notifications for upcoming events
- **Theme Support**: Dark/light mode with smooth transitions
- **Search & Filter**: Advanced event discovery
- **Responsive Design**: Works on desktop, tablet, and mobile

## 📁 **Project Structure**

```
Schedular/
├── web-angular/          # 🎨 Frontend (Angular 18+)
│   ├── src/app/
│   │   ├── components/   # Calendar components
│   │   ├── services/     # Business logic & state
│   │   ├── models/       # TypeScript interfaces
│   │   └── shared/       # Reusable components
│   └── README.md         # Frontend documentation
│
├── backend/              # 🔧 Backend API (NestJS + PostgreSQL)
│   ├── src/
│   │   ├── entities/     # Database models
│   │   ├── services/     # Business logic
│   │   ├── controllers/  # API endpoints
│   │   ├── dto/          # Data validation
│   │   └── scripts/      # Database utilities
│   └── README.md         # Backend documentation
│
└── README.md            # This file
```

## 🚀 **Getting Started**

### **Option 1: Frontend Only (Recommended for Learning)**
```bash
cd web-angular
npm install
ng serve
```
Visit: `http://localhost:4200`

**Perfect for:**
- Learning Angular development
- Understanding calendar implementations
- Prototyping and demos
- Static site deployment

### **Option 2: Full-Stack Development**
```bash
# Terminal 1: Start Backend
cd backend
npm install
# Set up PostgreSQL database (see backend/README.md)
npm run start:dev

# Terminal 2: Start Frontend  
cd web-angular
npm install
ng serve
```

**Perfect for:**
- Learning full-stack development
- Understanding API design
- Building production applications
- Database-driven features

## 🛠️ **Technology Stack**

### **Frontend (web-angular/)**
- **Framework**: Angular 18+ with standalone components
- **Calendar**: FullCalendar 6+ for calendar views
- **Styling**: Tailwind CSS for responsive design
- **State**: RxJS BehaviorSubjects for reactive state
- **Storage**: localStorage for offline persistence
- **Icons**: Lucide icons for modern UI

### **Backend (backend/)**
- **Framework**: NestJS 11+ (Node.js/TypeScript)
- **Database**: PostgreSQL with TypeORM
- **Validation**: class-validator & class-transformer
- **API**: RESTful endpoints with comprehensive CRUD
- **Architecture**: Modular service-controller pattern

## 🌟 **Key Features**

### **📅 Calendar Views**
- Month, week, and day views
- Event creation by clicking/dragging
- Drag-and-drop event editing
- Responsive design for all devices

### **🔄 Recurring Events**
- Daily, weekly, monthly, yearly patterns
- Custom intervals (every 2 weeks, etc.)
- Specific days of week/month
- End date or occurrence count limits
- Exception handling for skipped dates

### **👥 Participant Management**
- Invite participants to events
- Track invitation status (accepted, declined, pending, maybe)
- Department-based organization
- Avatar integration with DiceBear API

### **🏷️ Category System**
- Color-coded event categories
- Visibility toggle for filtering
- Default categories included
- Custom category creation

### **🔔 Notification System**
- Browser notifications for upcoming events
- Customizable timing (15 min, 1 hour, etc.)
- Multiple notification types
- Persistent notification preferences

### **🎨 Theme Support**
- Light and dark mode
- Smooth transitions
- System preference detection
- Persistent theme selection

## 📚 **Educational Value**

### **Frontend Concepts Demonstrated**
- Angular standalone components
- Reactive programming with RxJS
- State management patterns
- Component communication (@Input/@Output)
- Service injection and dependency management
- Template-driven forms
- Custom validators
- Lifecycle hooks
- Third-party library integration

### **Backend Concepts Demonstrated**
- NestJS modular architecture
- TypeORM entity relationships
- DTO validation patterns
- RESTful API design
- Database migrations
- Error handling strategies
- CORS configuration
- Environment configuration

### **Full-Stack Integration**
- API design and consumption
- Data transformation between layers
- Error handling across the stack
- Authentication patterns (ready for implementation)
- Real-time features (WebSocket ready)

## 🔍 **Quick Search Guide**

Find specific functionality quickly:

| Search Term | What You'll Find |
|-------------|------------------|
| `REPLACE_WITH_API` | All API integration points |
| `TODO:` | Areas for improvement |
| `Educational Note:` | Learning explanations |
| `@Input()` / `@Output()` | Component communication |
| `subscribe()` | RxJS usage patterns |
| `localStorage` | Data persistence |
| `FullCalendar` | Calendar integration |
| `BehaviorSubject` | State management |

## 🚀 **Deployment Options**

### **Frontend Deployment**
- **Netlify**: Drag & drop the `dist/` folder
- **Vercel**: Connect GitHub repo for auto-deploy
- **GitHub Pages**: Enable in repository settings
- **Firebase Hosting**: `firebase deploy`
- **Any static host**: Upload built files

### **Backend Deployment**
- **Railway**: One-click PostgreSQL + Node.js
- **Heroku**: Git-based deployment
- **DigitalOcean**: App Platform deployment
- **AWS**: Elastic Beanstalk or ECS
- **Docker**: Containerized deployment

## 🤝 **Contributing**

This project is designed to be educational and extensible:

1. **Fork** the repository
2. **Explore** the codebase and documentation
3. **Experiment** with new features
4. **Share** your improvements
5. **Learn** from others' contributions

## 📄 **License**

This project is open source and available under the MIT License. Feel free to use it for learning, teaching, or building your own applications.

---

**Ready to build something amazing?** 🚀

Choose your path:
- 🎨 **Frontend Focus**: `cd web-angular && npm install && ng serve`
- 🔧 **Full-Stack**: Set up both frontend and backend
- 📚 **Learning**: Start with the frontend, explore the code, then add the backend

**No more hunting for packages. No more complex setups. Just pure, educational, production-ready code.** ✨ 