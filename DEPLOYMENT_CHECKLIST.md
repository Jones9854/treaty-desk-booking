# 🚀 Deployment Checklist

Use this checklist to deploy your Treaty Software Desk Booking System to GitHub Pages.

---

## ✅ Pre-Deployment Checklist

- [x] ✅ Project built successfully (`npm run build`)
- [x] ✅ All TypeScript errors resolved
- [x] ✅ Dependencies installed
- [x] ✅ Dev server runs without errors
- [x] ✅ GitHub Actions workflow configured
- [x] ✅ Vite base path configured (`/treaty-desk-booking/`)

---

## 📋 GitHub Repository Setup

### Step 1: Create Repository on GitHub
- [ ] Go to https://github.com/new
- [ ] Repository name: `treaty-desk-booking`
- [ ] Description: "Desk booking and social activity platform for Treaty Software"
- [ ] Visibility: Choose Public or Private
- [ ] **DO NOT** check "Initialize with README"
- [ ] Click "Create repository"

### Step 2: Initialize Git Locally
```bash
cd /Users/christianjones/treaty-desk-booking
git init
git add .
git commit -m "Initial commit: Treaty Software Desk Booking System

Features:
- Hot desk booking system (15 desks, 2 per week limit)
- Social activity feed and creation
- User authentication
- LocalStorage persistence
- Beautiful responsive UI"
```

### Step 3: Connect to GitHub
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/treaty-desk-booking.git
```
⚠️ **IMPORTANT**: Replace `YOUR_USERNAME` with your actual GitHub username!

### Step 4: Push Code
```bash
git push -u origin main
```

---

## 🌐 Enable GitHub Pages

### Step 1: Access Repository Settings
- [ ] Go to your repository: `https://github.com/YOUR_USERNAME/treaty-desk-booking`
- [ ] Click the **"Settings"** tab (top right)

### Step 2: Configure Pages
- [ ] In the left sidebar, click **"Pages"**
- [ ] Under "Build and deployment":
  - Source: Select **"GitHub Actions"**
  - (Not "Deploy from a branch")

### Step 3: Wait for Deployment
- [ ] Go to the **"Actions"** tab
- [ ] Wait for the workflow to complete (should be ~1-2 minutes)
- [ ] Green checkmark = Success! ✅
- [ ] Red X = Failed (check logs for errors) ❌

### Step 4: Verify Deployment
- [ ] Return to Settings → Pages
- [ ] You should see: "Your site is live at https://YOUR_USERNAME.github.io/treaty-desk-booking/"
- [ ] Click the URL to open your site
- [ ] Test login, booking, and activities

---

## 🎯 Custom Domain (Optional)

If you want to use your own domain:

### Step 1: Configure DNS
Add CNAME record pointing to:
```
YOUR_USERNAME.github.io
```

### Step 2: Update GitHub
- [ ] In Settings → Pages → Custom domain
- [ ] Enter your domain (e.g., `treaty-desk.example.com`)
- [ ] Wait for DNS check
- [ ] Enable "Enforce HTTPS"

### Step 3: Update Vite Config
Edit `vite.config.ts`:
```typescript
base: '/', // Remove /treaty-desk-booking/
```

Then commit and push:
```bash
git add vite.config.ts
git commit -m "Update base URL for custom domain"
git push
```

---

## 🔧 Troubleshooting

### Workflow Failed
1. Go to Actions tab
2. Click on failed workflow
3. Expand failed step
4. Read error message
5. Common issues:
   - Build errors: Check TypeScript/lint errors
   - Permission errors: Enable workflow permissions in Settings
   - Node version: Workflow uses Node 20

### Page Shows 404
1. Check base path in `vite.config.ts`
   - Should be `/treaty-desk-booking/` for GitHub Pages
   - Should be `/` for custom domain
2. Ensure Pages is enabled with GitHub Actions
3. Verify workflow completed successfully

### Page Loads But Broken
1. Check browser console (F12) for errors
2. Verify base path matches repository name
3. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
4. Clear browser cache

### Changes Not Appearing
1. Wait a few minutes for GitHub cache
2. Hard refresh browser
3. Check Actions tab - workflow must complete
4. Verify you pushed changes: `git status`

---

## 🔄 Updating the Site

After making changes:

```bash
# 1. Make your changes to the code
# 2. Test locally
npm run dev

# 3. Build to verify
npm run build

# 4. Commit changes
git add .
git commit -m "Description of your changes"

# 5. Push to GitHub
git push

# 6. Wait for auto-deployment (1-2 minutes)
```

The site will automatically rebuild and redeploy!

---

## 📊 Post-Deployment Testing

After deployment, test these features:

### Basic Functionality
- [ ] Site loads without errors
- [ ] Login screen appears
- [ ] Can sign in with name/email
- [ ] Navigation works

### Desk Booking
- [ ] Calendar displays correctly
- [ ] Can book a desk
- [ ] Booking counter updates
- [ ] Can cancel booking
- [ ] Weekly limit enforced
- [ ] Availability colors correct
- [ ] "Who's in office" displays

### Social Activities
- [ ] Can switch to Social tab
- [ ] Activity feed loads
- [ ] Can create new activity
- [ ] Can join activity
- [ ] Can leave activity
- [ ] Participant avatars show
- [ ] Office presence indicator works

### Data Persistence
- [ ] Refresh page - bookings persist
- [ ] Refresh page - activities persist
- [ ] Sign out and back in - data remains

### Responsive Design
- [ ] Test on mobile
- [ ] Test on tablet
- [ ] Test on desktop
- [ ] All breakpoints work

---

## 🎊 Success Checklist

- [ ] ✅ Site is live on GitHub Pages
- [ ] ✅ All features working
- [ ] ✅ No console errors
- [ ] ✅ Mobile responsive
- [ ] ✅ Data persists across sessions
- [ ] ✅ Team can access the URL
- [ ] ✅ Shared URL with colleagues

---

## 📢 Share With Team

Once deployed, share with your team:

```
🎉 New Treaty Software Desk Booking System is Live!

📅 Book your desk: https://YOUR_USERNAME.github.io/treaty-desk-booking/

Features:
✅ Book hot desks (15 available per day)
✅ 2 bookings per week
✅ See who's in the office
✅ Create and join social activities
✅ Lunch and after-work events

Just enter your name and email to get started!
```

---

## 🔐 Security Notes

- All data stored locally in browser (no server)
- No passwords or sensitive data transmitted
- Public repository = anyone can see code
- Private repository = only you can see code
- For production use, consider:
  - Real backend (Firebase, Supabase)
  - Proper authentication (OAuth, SSO)
  - Database for shared data
  - User permissions

---

## 📈 Next Steps

After successful deployment:

1. **Monitor Usage**
   - Watch for GitHub Issues
   - Collect user feedback
   - Track feature requests

2. **Iterate and Improve**
   - Add requested features
   - Fix bugs
   - Enhance UX

3. **Scale Up**
   - Add real backend if needed
   - Implement notifications
   - Add analytics
   - Mobile app version

---

## 🆘 Need Help?

1. Check README.md for full documentation
2. Check QUICKSTART.md for common issues
3. Check GitHub Actions logs for errors
4. Open GitHub Issue for support
5. Review Vite documentation
6. Review GitHub Pages documentation

---

## ✨ Congratulations!

You've successfully deployed a modern, beautiful desk booking system!

**Your site**: https://YOUR_USERNAME.github.io/treaty-desk-booking/

🎉 **Well done!**

---

Last Updated: November 6, 2025

