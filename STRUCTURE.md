# 📁 Project Structure

```
treaty-desk-booking/
│
├── 📄 Configuration Files
│   ├── package.json              # Dependencies and scripts
│   ├── package-lock.json         # Locked dependency versions
│   ├── vite.config.ts           # Vite build configuration
│   ├── tsconfig.json            # TypeScript configuration
│   ├── tsconfig.node.json       # TypeScript config for Node
│   ├── tsconfig.app.json        # TypeScript config for app
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── postcss.config.js        # PostCSS configuration
│   ├── eslint.config.js         # ESLint linting rules
│   ├── .npmrc                   # npm configuration
│   └── .gitignore               # Git ignore rules
│
├── 📚 Documentation
│   ├── README.md                # Main documentation
│   ├── QUICKSTART.md           # Quick start guide
│   ├── PROJECT_SUMMARY.md      # Project overview
│   ├── FEATURES.md             # Feature showcase
│   ├── DEPLOYMENT_CHECKLIST.md # Deployment guide
│   └── STRUCTURE.md            # This file
│
├── 🔄 GitHub Actions
│   └── .github/
│       └── workflows/
│           └── deploy.yml       # Auto-deployment workflow
│
├── 🌐 Entry Point
│   └── index.html               # HTML entry point
│
├── 📦 Public Assets
│   └── public/
│       └── vite.svg             # Vite logo
│
└── 💻 Source Code
    └── src/
        ├── main.tsx             # React entry point
        ├── App.tsx              # Main App component
        ├── types.ts             # TypeScript interfaces
        ├── index.css            # Global styles (Tailwind)
        ├── App.css              # App-specific styles
        │
        ├── 🎨 Components
        │   ├── LoginScreen.tsx      # User authentication
        │   ├── Navigation.tsx       # Top navigation bar
        │   ├── DeskBooking.tsx      # Desk booking calendar
        │   └── SocialFeed.tsx       # Activities & social feed
        │
        └── 📁 Assets
            └── react.svg         # React logo
```

---

## 📝 File Descriptions

### Configuration Files

**package.json**
- Project metadata
- Dependencies (React, Vite, TailwindCSS, etc.)
- Scripts (dev, build, preview, deploy)

**vite.config.ts**
- Vite configuration
- React plugin setup
- Base path for GitHub Pages

**tsconfig.json**
- TypeScript compiler options
- Strict type checking enabled
- Modern ES2020 target

**tailwind.config.js**
- Custom color palette (primary blues/purples)
- Content paths for Tailwind
- Theme extensions

---

### Documentation Files

**README.md** (5.4 KB)
- Complete project documentation
- Installation instructions
- Feature overview
- Tech stack details
- Contributing guidelines

**QUICKSTART.md** (2.3 KB)
- Fast setup instructions
- Common troubleshooting
- Quick commands
- Deployment overview

**PROJECT_SUMMARY.md** (Comprehensive)
- Detailed project overview
- All features explained
- Customization guide
- Build statistics

**FEATURES.md** (Detailed)
- Feature showcase
- UI/UX highlights
- User flows
- Design system

**DEPLOYMENT_CHECKLIST.md** (Step-by-step)
- Pre-deployment checks
- GitHub setup guide
- Pages configuration
- Testing checklist

---

### Source Code Structure

#### Main Files

**main.tsx**
- React DOM rendering
- App component mount
- Strict mode wrapper

**App.tsx** (~150 lines)
- Main application logic
- Tab navigation (Bookings/Social)
- State management
- localStorage integration
- User authentication flow

**types.ts** (~40 lines)
- TypeScript interfaces:
  - User
  - Booking
  - Activity
  - Comment

**index.css**
- Tailwind directives
- Global styles
- Gradient background
- Font configuration

---

#### Components

**LoginScreen.tsx** (~80 lines)
- Beautiful login UI
- Name and email inputs
- Form validation
- Company branding
- Gradient design

**Navigation.tsx** (~40 lines)
- Top navigation bar
- User info display
- Sign out button
- Company logo
- Responsive layout

**DeskBooking.tsx** (~200 lines)
**Key Features:**
- 14-day calendar view
- Desk availability tracking
- Booking/canceling logic
- Weekly limit enforcement (2 days)
- Max capacity (15 desks)
- "Who's in office" section
- Real-time feedback messages
- Color-coded availability

**SocialFeed.tsx** (~280 lines)
**Key Features:**
- Activity feed display
- Create activity modal
- Join/leave functionality
- Participant management
- Activity suggestions
- Office presence integration
- Lunch and after-work types
- Visual participant avatars

---

## 🎯 Component Hierarchy

```
App
├── LoginScreen (if not authenticated)
│   ├── Form inputs
│   └── Submit button
│
└── Authenticated View
    ├── Navigation
    │   ├── Logo
    │   ├── User info
    │   └── Sign out button
    │
    └── Main Content
        ├── Tab Navigation
        │   ├── Bookings tab
        │   └── Social tab
        │
        ├── DeskBooking (if bookings tab active)
        │   ├── Header with counter
        │   ├── Status messages
        │   ├── Calendar grid (14 days)
        │   │   └── Day cards
        │   │       ├── Date display
        │   │       ├── Availability badge
        │   │       ├── Booking count
        │   │       └── Book/Cancel button
        │   └── Who's in office section
        │       └── Daily attendance lists
        │
        └── SocialFeed (if social tab active)
            ├── Header with create button
            ├── Suggested activities section
            ├── Activity feed
            │   └── Activity cards
            │       ├── Type badge
            │       ├── Title & description
            │       ├── Date/time/participants
            │       ├── Office presence
            │       ├── Participant avatars
            │       └── Join/Leave button
            │
            └── Create Activity Modal
                └── Form fields
                    ├── Type selector
                    ├── Title input
                    ├── Description textarea
                    ├── Date picker
                    ├── Time picker
                    ├── Max participants
                    └── Submit/Cancel buttons
```

---

## 🔄 Data Flow

```
┌─────────────────┐
│  localStorage   │
│  - currentUser  │
│  - bookings     │
│  - activities   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│     App.tsx     │ ← Main state management
│  - currentUser  │
│  - bookings[]   │
│  - activities[] │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ↓         ↓
┌──────┐  ┌──────┐
│ Desk │  │Social│
│Booking│ │ Feed │
└──────┘  └──────┘
```

---

## 🎨 Styling Architecture

```
Tailwind CSS
├── Base styles (index.css)
├── Component styles (inline with Tailwind classes)
└── Custom theme (tailwind.config.js)
    ├── Primary color palette
    ├── Gradient utilities
    └── Custom spacing
```

---

## 🚀 Build Process

```
Source Files (.tsx, .ts, .css)
         ↓
    TypeScript Compiler (tsc)
         ↓
    Vite Bundler
         ↓
    PostCSS + Tailwind
         ↓
    Optimized Output
         ↓
    dist/ folder
         ├── index.html
         ├── assets/
         │   ├── index-[hash].css
         │   └── index-[hash].js
         └── vite.svg
```

---

## 📦 Dependencies

### Production
- `react` - UI framework
- `react-dom` - React rendering
- `lucide-react` - Icon library

### Development
- `vite` - Build tool
- `typescript` - Type safety
- `@vitejs/plugin-react` - React support
- `tailwindcss` - Styling
- `autoprefixer` - CSS compatibility
- `postcss` - CSS processing
- `gh-pages` - Deployment tool

---

## 🔧 Scripts

```bash
npm run dev       # Start dev server (port 5173)
npm run build     # TypeScript compile + Vite build
npm run preview   # Preview production build
npm run deploy    # Build + deploy to gh-pages
```

---

## 📊 File Sizes

```
Component Files:
- LoginScreen.tsx    ~2.5 KB
- Navigation.tsx     ~1.5 KB
- DeskBooking.tsx    ~8.0 KB
- SocialFeed.tsx     ~11.0 KB
- App.tsx            ~5.0 KB
- types.ts           ~0.5 KB

Total Source Code: ~29 KB

Documentation:
- README.md                  ~5.4 KB
- QUICKSTART.md              ~2.3 KB
- PROJECT_SUMMARY.md         ~8.5 KB
- FEATURES.md                ~6.0 KB
- DEPLOYMENT_CHECKLIST.md    ~4.5 KB

Total Documentation: ~27 KB

Production Build:
- CSS (gzipped)      4.26 KB
- JS (gzipped)       52.02 KB
- HTML               0.54 KB

Total Build: ~57 KB (gzipped)
```

---

## 🎯 Key Files to Know

### For Development
1. `src/App.tsx` - Main application logic
2. `src/components/*.tsx` - All UI components
3. `src/types.ts` - Data structures

### For Configuration
1. `vite.config.ts` - Build settings
2. `package.json` - Dependencies
3. `tailwind.config.js` - Styling theme

### For Deployment
1. `.github/workflows/deploy.yml` - Auto-deployment
2. `README.md` - Documentation
3. `DEPLOYMENT_CHECKLIST.md` - Deploy guide

---

## 🔍 Finding Things

**Need to change colors?**
→ `tailwind.config.js`

**Need to change desk limit?**
→ `src/components/DeskBooking.tsx` (MAX_DESKS constant)

**Need to change weekly booking limit?**
→ `src/components/DeskBooking.tsx` (getUserBookingsCount function)

**Need to add new features?**
→ Create new component in `src/components/`
→ Import and use in `src/App.tsx`

**Need to change deployment settings?**
→ `vite.config.ts` (base path)
→ `.github/workflows/deploy.yml` (GitHub Actions)

**Need to update docs?**
→ `README.md` (main docs)
→ Other .md files for specific topics

---

## ✨ Code Quality

- ✅ TypeScript strict mode enabled
- ✅ ESLint configured
- ✅ No console warnings
- ✅ No TypeScript errors
- ✅ Clean component structure
- ✅ Proper prop types
- ✅ Commented code where needed
- ✅ Consistent naming conventions
- ✅ Modular components
- ✅ Reusable patterns

---

**Last Updated**: November 6, 2025
**Total Files**: 29
**Total Lines of Code**: ~1,500
**Build Status**: ✅ Success

