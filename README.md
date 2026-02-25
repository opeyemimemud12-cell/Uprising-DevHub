# Uprising DevHub — Starter Template

This is a responsive starter template for Uprising DevHub — an indie game developer platform.

## Quick start

1. Open `index.html` in your browser, or run a local server (see below).

## Features

- Hero with gradients and CTA
- Game submission modal with warning card
- Category horizontal carousels with arrow controls
- User authentication (signup/login) with profile avatars
- Comments and upvote system
- Real-time search across games
- Delete & edit game functionality
- LocalStorage-based persistence (replace with real cloud)
- Responsive mobile, tablet, and desktop layouts
- Vibrant category bubbles with unique gradients

## Local dev server with live reload

**Option 1: Python (built-in)**
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**Option 2: Node.js with live-server**
```bash
npm install -g live-server
live-server
```
This auto-reloads when you save files.

**Option 3: Node.js with http-server**
```bash
npx http-server
```

## Deploy to GitHub Pages

### Step 1: Create a GitHub repository
1. Go to [github.com/new](https://github.com/new)
2. Name it `my-website` (or any name)
3. Choose **Public** repository
4. Click **Create repository**

### Step 2: Initialize git and push files
```bash
cd "c:\Users\LENOVO\Desktop\my website"
git init
git add .
git commit -m "Initial commit: Uprising DevHub"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/my-website.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Branch", select `main`
4. Click **Save**
5. Your site will be live at: `https://YOUR_USERNAME.github.io/my-website`

### Step 4: Custom domain (optional)
In Settings → Pages, add your custom domain and follow GitHub's instructions.

## Important Notes for Deployment

⚠️ **localStorage Limitation:** GitHub Pages is static hosting. Data persists only in **each user's browser**. When deploying to production:
- Users on different devices won't see each other's games
- Consider migrating to a real backend (Firebase, AWS, Supabase, etc.)

### Recommended Cloud Migration:
```javascript
// Replace saveGameToCloud() in script.js with:
async function saveGameToCloud(game){
  const cu = loadCurrentUser();
  if(!cu) return false;
  
  // Example: Firebase Firestore
  await db.collection('games').add({
    ...game,
    developer: cu.email,
    timestamp: new Date()
  });
  return true;
}
```

## Cloud integration

- The template uses `localStorage` for local persistence.
- For production with shared games, replace `saveGameToCloud` in `script.js` with your cloud SDK (Firebase, Supabase, AWS recommended).

## Next steps (suggested)

- Plug in Firebase Auth + Firestore for real multi-user support
- Add image upload to cloud storage (Firebase Storage, S3, etc.)
- Implement robust user profiles and backend security
- Add email verification and password reset flows
- Deploy to custom domain

## Support

For issues or questions, check the code comments in `script.js` and `styles.css`.


