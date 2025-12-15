# CABZONE - Fleet Management Platform

A complete cab fleet management solution combining a modern marketing landing page with a powerful React-based dashboard.

## 🚀 Quick Start

### View the Application

1. **Open Landing Page**: Simply open `index.html` in your browser
2. **Access Dashboard**: Click the "Login" button or navigate to `dashboard/dist/index.html`

### Which file opens / How the site starts

- Static landing site (root): the browser opens `index.html` in the repository root. You can open it by double-clicking the file or from PowerShell:

```powershell
Start-Process .\index.html
```

- React dashboard (development): Vite serves `dashboard/index.html`, which mounts the React app at `<div id="root">` and loads `/src/main.jsx`.

    - To run the dashboard in development (PowerShell):

    ```powershell
    cd dashboard
    npm install
    npm run dev
    ```

    - To build and preview the production bundle:

    ```powershell
    cd dashboard
    npm run build
    npm run preview
    # or open the built file directly:
    Start-Process .\dashboard\dist\index.html
    ```

### Demo Credentials

**Owner Dashboard:**
- Username: `owner`
- Password: `owner123`

**Driver Dashboard:**
- Username: `driver`
- Password: `driver123`

## 📁 Structure

```
├── index.html          # Landing page
├── styles.css          # Landing page styles
├── script.js           # Landing page scripts
├── images/             # Assets
└── dashboard/          # React dashboard
    ├── src/            # Source code
    └── dist/           # Production build ✅
```

## 🛠️ Development

### Landing Page
No build required - just edit and refresh!

### React Dashboard

```bash
cd dashboard
npm install
npm run dev      # Development server
npm run build    # Production build
```

## ✨ Features

### Landing Page
- Hero section with statistics
- Feature comparison
- Pricing plans
- Customer testimonials
- FAQ section
- Contact form

### Dashboard
- **Owner**: Full fleet management, analytics, document vault
- **Driver**: Personal dashboard, trip history, earnings

## 📖 Documentation

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed documentation.

## 🌐 Deployment

Upload the entire folder to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting

## 💡 Tech Stack

- **Landing**: HTML5, CSS3, JavaScript, Chart.js
- **Dashboard**: React, Vite, TailwindCSS, Framer Motion

---

**Ready to revolutionize fleet management!** 🚗💨
