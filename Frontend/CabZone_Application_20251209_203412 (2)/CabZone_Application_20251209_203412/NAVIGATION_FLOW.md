# Navigation Flow

## User Journey

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    LANDING PAGE                             │
│                   (index.html)                              │
│                                                             │
│  ┌──────────────────────────────────────────────────┐      │
│  │  Navigation Bar                                  │      │
│  │  [CABZONE] [Why Choose Us] [Pricing] [Contact]  │      │
│  │                                    [🔐 Login] ────┼──┐   │
│  └──────────────────────────────────────────────────┘  │   │
│                                                         │   │
│  • Hero Section                                        │   │
│  • Challenges We Solve                                 │   │
│  • Why Choose Us (Comparison)                          │   │
│  • Customer Testimonials                               │   │
│  • Pricing Plans                                       │   │
│  • FAQ Section                                         │   │
│  • Contact Form                                        │   │
│  • Growth Statistics                                   │   │
│                                                         │   │
└─────────────────────────────────────────────────────────┼───┘
                                                          │
                                                          │ Click Login
                                                          ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    LOGIN PAGE                               │
│              (dashboard/dist/index.html)                    │
│                                                             │
│  ┌──────────────────────────────────────────────────┐      │
│  │  [🏠 Back to Home] ◄─────────────────────────────┼──┐   │
│  └──────────────────────────────────────────────────┘  │   │
│                                                         │   │
│  ┌──────────────────────────────────────────────────┐  │   │
│  │           🚗 CabDoc                              │  │   │
│  │   Digital Fleet Document Manager                │  │   │
│  │                                                  │  │   │
│  │   Username: [____________]                      │  │   │
│  │   Password: [____________]                      │  │   │
│  │                                                  │  │   │
│  │   [        Login        ]                       │  │   │
│  │                                                  │  │   │
│  │   Demo Credentials:                             │  │   │
│  │   Owner:  owner / owner123                      │  │   │
│  │   Driver: driver / driver123                    │  │   │
│  └──────────────────────────────────────────────────┘  │   │
│                                                         │   │
└─────────────────────────────────────────────────────────┼───┘
                                                          │
                                                          │ Back to Home
                                                          ▼
                                                    Landing Page
                    ┌──────────────────┐
                    │  Login Success   │
                    └────────┬─────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
    ┌───────────────────────┐  ┌──────────────────────┐
    │   OWNER DASHBOARD     │  │   DRIVER DASHBOARD   │
    │                       │  │                      │
    │  • Dashboard Overview │  │  • Personal Stats    │
    │  • Live Tracking      │  │  • Trip History      │
    │  • Driver Management  │  │  • Earnings          │
    │  • Vehicle Management │  │  • Documents         │
    │  • Leaderboard        │  │  • Performance       │
    │  • Document Vault     │  │                      │
    │  • Analytics          │  │                      │
    │  • Expenses           │  │                      │
    │  • Communication      │  │                      │
    │  • Settings           │  │                      │
    │  • AI Assistant       │  │                      │
    └───────────────────────┘  └──────────────────────┘
```

## File Paths

### Landing Page
- **URL**: `/index.html`
- **Files**: `index.html`, `styles.css`, `script.js`
- **Assets**: `images/`

### Dashboard
- **URL**: `/dashboard/dist/index.html`
- **Build**: `dashboard/dist/`
- **Source**: `dashboard/src/`

## Navigation Links

### From Landing Page to Dashboard
```html
<a href="dashboard/dist/index.html" class="login-btn">Login</a>
```

### From Dashboard to Landing Page
```html
<a href="../../index.html">Back to Home</a>
```

## URL Structure

### Development
- Landing: `file:///path/to/index.html`
- Dashboard: `file:///path/to/dashboard/dist/index.html`

### Production (with server)
- Landing: `https://yourdomain.com/`
- Dashboard: `https://yourdomain.com/dashboard/dist/index.html`
- Or: `https://yourdomain.com/dashboard/dist/#/login`

## Router Configuration

The dashboard uses **HashRouter** which means URLs will look like:
- Login: `dashboard/dist/index.html#/login`
- Owner: `dashboard/dist/index.html#/owner`
- Driver: `dashboard/dist/index.html#/driver`

This ensures compatibility with static file hosting without server-side routing.

## Key Features

### Landing Page
✅ Static HTML/CSS/JS - No build required
✅ Works directly from file system
✅ Fast loading
✅ SEO friendly

### Dashboard
✅ React SPA with routing
✅ Built with Vite
✅ Optimized production bundle
✅ Code splitting ready

## Testing Checklist

- [ ] Landing page loads correctly
- [ ] All sections visible and styled
- [ ] Login button navigates to dashboard
- [ ] Dashboard login page loads
- [ ] Back to Home button returns to landing
- [ ] Owner login works (owner/owner123)
- [ ] Driver login works (driver/driver123)
- [ ] Dashboard features accessible
- [ ] Responsive on mobile/tablet
- [ ] No console errors

## Deployment Notes

When deploying:
1. Upload entire `cab services` folder
2. Set `index.html` as default document
3. Ensure proper MIME types for `.js` and `.css`
4. Test all navigation paths
5. Verify assets load correctly

---

**Navigation is seamless and user-friendly!** 🎯
