# GitHub Pages Deployment Guide

## Complete Setup Instructions

This portfolio is fully configured for GitHub Pages deployment with automatic builds via GitHub Actions.

### Step 1: Extract and Initialize

```bash
# Extract the zip file
unzip gaaurav-portfolio-complete.zip
cd gaauravlath

# Initialize git (if not already done)
git init
git remote add origin https://github.com/gaauravmlath/gaauravlath.git
git branch -M main
```

### Step 2: Push to GitHub

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit: Portfolio website with GitHub Pages setup"

# Push to main branch
git push -u origin main
```

### Step 3: GitHub Actions Will Automatically Deploy

Once you push to `main`:
1. GitHub Actions workflow will trigger automatically
2. It will install dependencies
3. Build the project with Vite
4. Deploy to GitHub Pages
5. Your site will be live at: **https://gaauravmlath.github.io/gaauravlath/**

### Step 4: Verify Deployment

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. You should see: "Your site is published at https://gaauravmlath.github.io/gaauravlath/"
4. Visit that URL and hard refresh (`Ctrl+Shift+R` or `Cmd+Shift+R`)

## What's Included

✅ **Complete source code** - All React components, styles, and assets  
✅ **Vite configuration** - Properly configured with base path `/gaauravlath/`  
✅ **GitHub Actions workflow** - Automatic build and deployment  
✅ **.nojekyll file** - Tells GitHub not to process with Jekyll  
✅ **All dependencies** - pnpm-lock.yaml for reproducible builds  
✅ **Professional data** - Your experience, projects, skills, and contact info  
✅ **Animations** - Neural network visualization, particles, smooth transitions  

## Project Structure

```
gaauravlath/
├── src/                          # React source code
│   ├── components/              # React components
│   │   ├── HeroNetwork.tsx      # Main hero with network visualization
│   │   ├── NetworkLoader.tsx    # Loading animation
│   │   ├── About.tsx            # About section
│   │   ├── Skills.tsx           # Skills section
│   │   ├── Experience.tsx       # Experience timeline
│   │   ├── Projects.tsx         # Projects showcase
│   │   ├── Contact.tsx          # Contact section
│   │   └── Footer.tsx           # Footer
│   ├── pages/                   # Page components
│   ├── lib/                     # Utilities and helpers
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── server/                       # Backend code (not used for GitHub Pages)
├── drizzle/                      # Database schema (not used for GitHub Pages)
├── vite.config.ts               # Vite configuration (base: "/gaauravlath/")
├── package.json                 # Dependencies
├── pnpm-lock.yaml               # Lock file for reproducible builds
├── .github/workflows/
│   └── deploy.yml               # GitHub Actions workflow
├── .nojekyll                    # Disable Jekyll processing
├── GITHUB_PAGES_README.md       # Quick reference guide
└── DEPLOYMENT_GUIDE.md          # This file
```

## Key Configuration

### Base Path
The site is configured to be served at `/gaauravlath/` subdirectory:

```typescript
// vite.config.ts
export default defineConfig({
  base: "/gaauravlath/",  // ← This is set correctly
  // ... rest of config
});
```

**To change this:**
1. Update `vite.config.ts`: Change `base: "/gaauravlath/"` to `base: "/"`
2. Rename your repository to `gaauravmlath.github.io`
3. Push changes - GitHub Actions will rebuild

### GitHub Actions Workflow
The `.github/workflows/deploy.yml` file automatically:
1. Triggers on push to `main` branch
2. Installs Node.js and pnpm
3. Installs dependencies: `pnpm install --frozen-lockfile`
4. Builds the project: `pnpm exec vite build`
5. Deploys to GitHub Pages: `dist/public/` folder

## Local Development

### Setup
```bash
pnpm install --frozen-lockfile
```

### Start Dev Server
```bash
pnpm dev
```
Open http://localhost:3000 in your browser

### Build for Production
```bash
pnpm exec vite build
```
Output goes to `dist/public/`

### Run Tests
```bash
pnpm test
```

## Making Updates

After making changes to your portfolio:

```bash
# Test locally
pnpm dev

# Build to verify
pnpm exec vite build

# Commit and push
git add .
git commit -m "Update portfolio: [describe changes]"
git push origin main
```

GitHub Actions will automatically rebuild and deploy!

## Troubleshooting

### Blank Page After Deployment

**Solution:**
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Open browser console (F12) and check for errors
3. Verify asset paths start with `/gaauravlath/`

**Check the HTML:**
- Go to https://gaauravmlath.github.io/gaauravlath/
- Right-click → View Page Source
- Look for `<script src="/gaauravlath/assets/..."`
- Look for `<link href="/gaauravlath/assets/..."`

### GitHub Actions Not Running

**Solution:**
1. Go to your repository → **Actions** tab
2. Check if workflow shows any errors
3. Verify `.github/workflows/deploy.yml` is in the main branch
4. Check that you pushed to `main` branch (not another branch)

### Assets Return 404

**Solution:**
1. Verify `dist/public/assets/` folder exists with CSS and JS files
2. Check that asset paths in `dist/public/index.html` are correct
3. Hard refresh browser cache

### Build Fails

**Solution:**
1. Check GitHub Actions logs for error messages
2. Try building locally: `pnpm exec vite build`
3. Fix any errors locally and push again

## Customization

### Edit Portfolio Content

**About Section:** `src/components/About.tsx`  
**Skills Section:** `src/components/Skills.tsx`  
**Experience:** `src/components/Experience.tsx`  
**Projects:** `src/components/Projects.tsx`  
**Contact:** `src/components/Contact.tsx`  

### Change Styling

**Global styles:** `src/index.css`  
**Tailwind config:** `tailwind.config.js`  
**Component styles:** Edit className in React components  

### Add New Sections

1. Create new component: `src/components/NewSection.tsx`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/HeroNetwork.tsx`
4. Push changes - GitHub Actions will rebuild

## Performance Notes

- **Bundle size:** ~1MB (gzipped ~250KB) - acceptable for GitHub Pages
- **Load time:** ~2-3 seconds on 4G
- **Animations:** Optimized for 60fps on modern browsers
- **Mobile:** Fully responsive and touch-optimized

## Next Steps

### Optional: Custom Domain
1. Go to GitHub Settings → Pages
2. Under "Custom domain", enter your domain
3. Follow GitHub's instructions for DNS setup

### Optional: Enable HTTPS
GitHub Pages automatically provides HTTPS certificates

### Optional: Add Analytics
Update the analytics endpoint in `index.html` if desired

## Support & Documentation

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

## Summary

Your portfolio is ready to deploy! Just:

1. Extract this zip file
2. Push to GitHub
3. GitHub Actions handles the rest
4. Your site goes live automatically

**That's it!** 🚀
