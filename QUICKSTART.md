# 🚀 Quick Start Guide

## Fix npm Cache Issue (If Needed)

If you encounter permission errors with npm, run:

```bash
sudo chown -R $(whoami) ~/.npm
```

Or use a different cache directory:

```bash
mkdir -p ~/.npm-cache
npm config set cache ~/.npm-cache
```

## Install and Run

1. **Install dependencies:**
```bash
cd /Users/christianjones/treaty-desk-booking
npm install --legacy-peer-deps
```

2. **Start development server:**
```bash
npm run dev
```

3. **Open your browser:**
   - Navigate to `http://localhost:5173`

## First Time Setup

1. Enter your name and email to sign in
2. Start booking desks for the upcoming days
3. Create social activities and invite colleagues!

## Deploy to GitHub Pages

1. **Create a new repository on GitHub** (e.g., `treaty-desk-booking`)

2. **Initialize git and push:**
```bash
git init
git add .
git commit -m "Initial commit: Treaty Software Desk Booking System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/treaty-desk-booking.git
git push -u origin main
```

3. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Under "Build and deployment", select "GitHub Actions"
   - The site will auto-deploy on every push!

4. **Update the base URL in vite.config.ts:**
   - Change `base: '/treaty-desk-booking/'` to match your repository name

Your site will be live at: `https://YOUR_USERNAME.github.io/treaty-desk-booking/`

## Manual Deployment

Alternatively, deploy manually:

```bash
npm run deploy
```

## Features Overview

### Desk Booking
- 📅 View 14-day calendar
- 🪑 15 desks maximum per day
- ✅ Book up to 2 days per week
- 👥 See who's in the office

### Social Activities
- 🍕 Create lunch events
- 🍻 Organize after-work activities
- 👥 Join colleague activities
- 💬 See suggested activities

## Troubleshooting

### Port already in use
```bash
# Kill the process using port 5173
lsof -ti:5173 | xargs kill -9
```

### Clear browser data
If you need to reset:
- Open DevTools (F12)
- Go to Application → Storage
- Click "Clear site data"

### Build fails
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## Tech Stack

- ⚛️ React 18 + TypeScript
- ⚡ Vite
- 🎨 TailwindCSS
- 🎯 Lucide Icons
- 💾 LocalStorage

Enjoy your new desk booking system! 🎉

