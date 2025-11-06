# 🏢 Treaty Software - Desk Booking System

A beautiful, modern desk booking and social activity platform built for Treaty Software employees. Manage hot desk reservations (max 15 desks per day) and coordinate social activities with your colleagues!

![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🪑 Desk Booking
- **Limited Capacity**: Only 15 hot desks available per day
- **Weekly Limit**: Book up to 2 days per week
- **Real-time Availability**: See desk availability at a glance
- **Who's in the Office**: View colleagues scheduled for each day
- **Easy Management**: Book or cancel your desk with one click

### 🤝 Social Activities
- **Create Events**: Organize lunch outings or after-work activities
- **Join Activities**: Connect with colleagues attending the same events
- **Activity Suggestions**: Get ideas for team bonding
- **Participant Management**: See who's joining and track capacity
- **Office Integration**: See who's in the office on activity days

### 💾 Data Persistence
- All data stored locally in your browser using localStorage
- No backend required - works completely offline
- Your bookings and activities persist across sessions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/treaty-desk-booking.git
cd treaty-desk-booking
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📦 Building for Production

Build the project for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## 🌐 Deploying to GitHub Pages

### Method 1: Automatic Deployment (GitHub Actions)

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/treaty-desk-booking.git
git push -u origin main
```

2. Enable GitHub Pages:
   - Go to your repository settings
   - Navigate to "Pages" in the left sidebar
   - Under "Build and deployment", select "GitHub Actions" as the source
   - The workflow will automatically deploy on every push to `main`

3. Update the `base` in `vite.config.ts` to match your repository name:
```typescript
base: '/treaty-desk-booking/', // Change to your repo name
```

### Method 2: Manual Deployment

1. Install the gh-pages package (already included):
```bash
npm install -D gh-pages
```

2. Build and deploy:
```bash
npm run deploy
```

Your site will be available at: `https://YOUR_USERNAME.github.io/treaty-desk-booking/`

## 🎨 Customization

### Changing Colors

Edit the color scheme in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Customize your primary color palette
      },
    },
  },
},
```

### Adjusting Desk Capacity

Change the maximum number of desks in `src/components/DeskBooking.tsx`:

```typescript
const MAX_DESKS = 15; // Change this value
```

### Modifying Booking Limits

Update the weekly booking limit in the `DeskBooking` component logic.

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Storage**: LocalStorage API

## 📱 Features in Detail

### Desk Booking System
- Visual calendar showing next 14 days
- Color-coded availability indicators
- User booking tracking
- Automatic validation of booking limits
- Past date handling

### Social Activity System
- Create lunch or after-work events
- Set date, time, and participant limits
- Visual participant avatars
- Integration with desk bookings
- Activity suggestions

### User Experience
- Beautiful gradient UI design
- Responsive layout for mobile and desktop
- Smooth transitions and hover effects
- Real-time feedback messages
- Intuitive navigation

## 🔒 Data Privacy

All data is stored locally in your browser's localStorage. No information is sent to external servers. To clear your data:

1. Open browser developer tools (F12)
2. Go to Application/Storage tab
3. Clear localStorage for the site

Or simply sign out and back in with a new profile.

## 🤝 Contributing

This is a demo project for Treaty Software. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is provided as-is for use by Treaty Software.

## 🙏 Acknowledgments

- Built with modern web technologies
- Icons by Lucide
- Gradient inspiration from various design resources

## 📞 Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

Made with ❤️ for Treaty Software
