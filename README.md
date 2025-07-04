# Fitmint 💪

A modern, feature-rich fitness tracking application built with React and Firebase. Track your workouts, manage routines, and stay motivated on your fitness journey.

![Fitmint Dashboard](https://img.shields.io/badge/Fitmint-Fitness%20Tracker-53FC18?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-11.9.1-FFCA28?style=for-the-badge&logo=firebase)
![Vite](https://img.shields.io/badge/Vite-7.0.0-646CFF?style=for-the-badge&logo=vite)

## 🌟 Features

### 📊 **Dashboard**
- **Personalized Greeting**: Time-based greetings with user's name
- **Today's Workout**: Display and track daily exercises from your routine
- **Progress Tracking**: Visual progress indicators and completion status
- **Motivational Quotes**: Daily fitness quotes to keep you inspired
- **Streak Counter**: Track consecutive workout days
- **Notes System**: Add and edit daily workout notes
- **Real-time Updates**: Instant sync with Firebase

### 🏋️ **Workout Management**
- **Weekly Routine Builder**: Create custom workouts for each day
- **Exercise Library**: Add exercises with sets, reps, and notes
- **Drag & Drop**: Easy exercise reordering
- **Quick Actions**: Add, edit, and delete exercises seamlessly
- **Notes per Day**: Add specific notes for each workout day

### 📱 **User Experience**
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Theme**: Modern dark UI with green accent colors
- **PWA Ready**: Progressive Web App with offline capabilities
- **Smooth Animations**: Beautiful transitions and micro-interactions
- **Bottom Navigation**: Mobile-optimized navigation
- **Loading States**: Skeleton loaders and spinners

### 🔐 **Authentication & Security**
- **Firebase Auth**: Secure user authentication
- **Google Sign-in**: Quick and easy login
- **Protected Routes**: Secure access to user data
- **Real-time Sync**: Automatic data synchronization

### 📈 **Data Management**
- **Export Options**: PDF, CSV, and JSON export formats
- **Import Functionality**: Import workout routines from files
- **Template Downloads**: Pre-built workout templates
- **Cloud Storage**: Firebase Firestore for data persistence
- **Backup & Restore**: Easy data backup and restoration

### 🌍 **Internationalization**
- **Multi-language Support**: Built with i18next
- **RTL Support**: Right-to-left language compatibility
- **Localized Content**: Translated UI elements

## 🚀 Live Demo

Visit the live application: **[Fitmint](https://fitmint.vercel.app/)**

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern UI library
- **Vite 7.0.0** - Fast build tool and dev server
- **React Router DOM 7.6.3** - Client-side routing
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **React Icons 5.5.0** - Icon library
- **React Toastify 11.0.5** - Toast notifications
- **Recharts 3.0.2** - Data visualization
- **Zustand 5.0.6** - State management

### Backend & Services
- **Firebase 11.9.1** - Backend as a Service
  - **Authentication** - User management
  - **Firestore** - NoSQL database
  - **Hosting** - Static file hosting
- **jsPDF 3.0.1** - PDF generation
- **jsPDF-AutoTable 5.0.2** - PDF table generation

### Development Tools
- **ESLint 9.29.0** - Code linting
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.21** - CSS vendor prefixes

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fitmint.git
   cd fitmint
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Google provider)
   - Create a Firestore database
   - Get your Firebase config and update `src/firebase.js`

4. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
fitmint/
├── public/                 # Static assets
│   ├── dmbbell.png        # App icon
│   ├── dmbbell.svg        # SVG icon
│   ├── manifest.json      # PWA manifest
│   └── sw.js             # Service worker
├── src/
│   ├── components/        # Reusable components
│   │   ├── layout/       # Layout components
│   │   └── workout/      # Workout-specific components
│   ├── pages/            # Page components
│   │   ├── Dashboard.jsx # Main dashboard
│   │   ├── Login.jsx     # Authentication
│   │   ├── MyRoutine.jsx # Workout management
│   │   └── Profile.jsx   # User profile
│   ├── store/            # State management
│   ├── styles/           # Global styles
│   ├── App.jsx           # Main app component
│   ├── firebase.js       # Firebase configuration
│   └── i18n.js          # Internationalization
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md            # This file
```

## 🎯 Key Features Explained

### Dashboard Overview
The dashboard provides a comprehensive view of your daily fitness activities:
- **Progress Tracking**: Visual indicators show completion status
- **Streak Counter**: Motivates users with consecutive day tracking
- **Quick Actions**: Easy access to add notes and mark exercises complete
- **Responsive Design**: Optimized for all device sizes

### Workout Routine Management
Create and manage your weekly workout schedule:
- **Day-by-Day Planning**: Organize exercises for each day of the week
- **Exercise Details**: Track sets, reps, and personal notes
- **Import/Export**: Share routines or backup your data
- **Template System**: Quick-start with pre-built workout templates

### Data Export Options
Multiple formats for data portability:
- **PDF Export**: Professional workout routine documents
- **CSV Export**: Spreadsheet-compatible format
- **JSON Export**: Developer-friendly data format

## 🔧 Configuration

### Firebase Setup
1. Enable Google Authentication in Firebase Console
2. Set up Firestore database with appropriate security rules
3. Configure CORS settings for your domain

### PWA Configuration
The app is configured as a Progressive Web App with:
- Service worker for offline functionality
- Web app manifest for app-like experience
- Responsive design for all screen sizes

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The app can be deployed to any static hosting service:
- Netlify
- Firebase Hosting
- GitHub Pages
- AWS S3 + CloudFront

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure responsive design compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Firebase Team** - For the powerful backend services
- **Tailwind CSS** - For the utility-first CSS framework
- **Vite Team** - For the fast build tool

## 📞 Support

- **Live Demo**: [https://fitmint.vercel.app/](https://fitmint.vercel.app/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/fitmint/issues)
- **Email**: support@fitmint.app

## 🔮 Roadmap

- [ ] **Social Features**: Share workouts with friends
- [ ] **Progress Analytics**: Advanced charts and insights
- [ ] **Workout Templates**: Pre-built routines for different goals
- [ ] **Nutrition Tracking**: Calorie and macro tracking
- [ ] **Mobile App**: Native iOS and Android apps
- [ ] **Wearable Integration**: Apple Watch and Fitbit support
- [ ] **AI Workout Recommendations**: Personalized exercise suggestions

---

**Made with ❤️ by Murtuja**

*Transform your fitness journey with Fitmint - where motivation meets technology.* 