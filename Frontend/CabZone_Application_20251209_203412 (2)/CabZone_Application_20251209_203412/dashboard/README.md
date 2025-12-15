# 🚕 FleetMaster Pro - Cab Owner Dashboard

A futuristic, web-based fleet management dashboard with glassmorphism UI design for cab owners to manage drivers, vehicles, documents, and analytics in real-time.

## ✨ Features

### 1. **Dashboard Overview**
- Real-time statistics cards (Total Cars, Drivers, Pending Documents, Recent Uploads)
- Earnings snapshot (Today, Monthly, Yearly)
- Smart notifications panel for expiring licenses and missing documents
- Recent activity feed

### 2. **Driver Management**
- Comprehensive driver table with details
- AI Document Verifier integration
- Send renewal reminders
- Driver performance metrics (ratings, trips)
- Status tracking (Active/Inactive)
- Verification status (Verified/Pending/Expired)

### 3. **Vehicle Management**
- Vehicle details table with RC numbers
- Fitness certificate tracking
- Insurance expiry monitoring
- Maintenance schedules
- Real-time status indicators
- GPS location integration ready

### 4. **Document Vault**
- Secure document storage
- Advanced filters (Driver, Vehicle, Expiry Date)
- Preview and download options
- Auto-rename feature for uploads
- AI verification badges
- Grid and list views

### 5. **Analytics & Insights**
- Interactive charts using Recharts
- Earnings trend analysis
- Driver performance metrics
- Vehicle downtime tracking
- Maintenance predictions
- Weekly trip distribution

### 6. **Communication Hub**
- Owner-to-driver messaging
- Real-time chat interface
- Automated alerts system
- Broadcast messaging
- Online/offline status indicators
- Message history

### 7. **Settings & Profile**
- Profile management
- Security settings with 2FA
- Notification preferences
- API integrations (AuthBridge, GPS, Payments)
- Theme customization
- Billing management

### 8. **Live GPS Tracking** 🆕
- Real-time vehicle location monitoring
- Interactive map view with vehicle markers
- Live speed and ETA tracking
- Vehicle status indicators (Active/Idle)
- Battery level monitoring
- Route optimization ready

### 9. **Driver Leaderboard & Gamification** 🆕
- Top performer rankings with podium display
- Achievement badges and milestones
- Driver levels (Platinum, Gold, Silver)
- Points and streak tracking
- Performance metrics comparison
- Gamification to boost motivation

### 10. **Expense Tracker** 🆕
- Comprehensive expense management
- Category-wise breakdown (Fuel, Maintenance, Salaries, etc.)
- Monthly trend analysis
- Profit/Loss calculations
- Recent transaction history
- Export and reporting features

### 11. **Bonus Features**
- **AI Assistant**: Intelligent chatbot for fleet queries
- **Smart Search**: Global search across all data
- **Theme Switcher**: Dark, Light, and Glass modes
- **Quick Actions Bar**: Fast access to common tasks
- **Responsive Design**: Works on all screen sizes
- **Animated Background**: Dynamic gradient with overlay effects
- **Glassmorphism UI**: Modern, beautiful interface
- **Smooth Animations**: Framer Motion powered transitions

## 🛠️ Tech Stack

- **React 18.3** - UI Framework
- **Vite 5.2** - Build Tool
- **TailwindCSS 3.4** - Styling
- **Lucide React** - Icons
- **Recharts 2.10** - Charts & Analytics
- **Framer Motion 11** - Animations

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn installed

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd dasnboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   The app will automatically open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
dasnboard/
├── src/
│   ├── components/
│   │   ├── DashboardOverview.jsx    # Main dashboard with stats
│   │   ├── DriverManagement.jsx     # Driver management table
│   │   ├── VehicleManagement.jsx    # Vehicle tracking
│   │   ├── DocumentVault.jsx        # Document storage
│   │   ├── Analytics.jsx            # Charts and insights
│   │   ├── CommunicationHub.jsx     # Messaging system
│   │   ├── SettingsPanel.jsx        # Settings & profile
│   │   ├── AIAssistant.jsx          # AI chatbot
│   │   └── QuickActions.jsx         # Quick action buttons
│   ├── App.jsx                      # Main app component
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 UI Features

### Glassmorphism Design
- Frosted glass effect with backdrop blur
- Transparent cards with subtle borders
- Gradient accents and hover effects
- Smooth transitions and animations

### Color Scheme
- **Primary**: Purple to Pink gradients
- **Success**: Green tones
- **Warning**: Orange tones
- **Error**: Red tones
- **Background**: Dark gradient (slate-900 to purple-900)

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔧 Customization

### Change Theme Colors
Edit `tailwind.config.js` to modify the color palette:

```javascript
theme: {
  extend: {
    colors: {
      // Add your custom colors here
    }
  }
}
```

### Modify Glassmorphism Effect
Edit the `.glass-card` class in `src/index.css`:

```css
.glass-card {
  @apply bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl;
}
```

## 📊 Data Integration

The dashboard currently uses mock data. To integrate with a real backend:

1. Create API service files in `src/services/`
2. Replace mock data with API calls
3. Add state management (Redux/Zustand) if needed
4. Implement authentication
5. Connect to your database

## 🔐 Security Features

- Two-Factor Authentication ready
- Secure document storage
- Role-based access control ready
- API integration support
- Password management

## 🌟 Key Highlights

- **Modern UI**: Glassmorphism design with smooth animations
- **Real-time Updates**: Live data tracking and notifications
- **AI-Powered**: Intelligent document verification and chatbot
- **Comprehensive**: All fleet management features in one place
- **Responsive**: Works seamlessly on all devices
- **Customizable**: Easy to theme and extend

## 📝 Future Enhancements

- [ ] Real-time GPS tracking map
- [ ] Mobile app integration
- [ ] Advanced reporting and exports
- [ ] Multi-language support
- [ ] Voice commands
- [ ] Offline mode
- [ ] Push notifications
- [ ] Integration with payment gateways

## 🐛 Known Issues

The CSS lint warnings about `@tailwind` and `@apply` directives are expected and will be processed correctly by PostCSS and TailwindCSS during build.

## 📄 License

This project is created for demonstration purposes.

## 👨‍💻 Author

Built with ❤️ for modern fleet management

## 🤝 Contributing

Feel free to fork, modify, and use this project for your needs!

---

**Note**: This is a frontend-only application. Backend integration, authentication, and real API connections need to be implemented based on your requirements.
