# Gaaurav Lath - Data Science Portfolio

## Quick Start for GitHub Pages Deployment

This repository contains a complete, production-ready portfolio website configured for GitHub Pages deployment.

### Prerequisites
- Node.js 18+ and pnpm installed
- GitHub repository ready (can be empty)

### One-Command Deployment

```bash
# 1. Install dependencies
pnpm install --frozen-lockfile

# 2. Build the project
pnpm exec vite build

# 3. Push to GitHub
git add .
git commit -m "Initial commit: Portfolio website"
git push origin main
```

GitHub Actions will automatically:
- Build your project
- Deploy to GitHub Pages
- Make it live at: https://gaauravmlath.github.io/gaauravlath/

### Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
# Build the project
pnpm install --frozen-lockfile
pnpm exec vite build

# Create gh-pages branch with built files
git checkout --orphan gh-pages
git rm -rf .
cp -r dist/public/* .
touch .nojekyll
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

Then go to GitHub Settings → Pages and select `gh-pages` branch as source.

### Project Structure

```
├── src/                    # React components and pages
├── server/                 # Backend code (not used for GitHub Pages)
├── drizzle/               # Database schema (not used for GitHub Pages)
├── client/public/         # Static assets
├── vite.config.ts         # Vite configuration (base path set for /gaauravlath/)
├── package.json           # Dependencies
└── .github/workflows/     # GitHub Actions workflow
    └── deploy.yml         # Auto-deployment configuration
```

### Key Configuration

**Base Path:** The site is configured to be served at `/gaauravlath/`

If you want to change this (e.g., to serve at root), update:
1. `vite.config.ts`: Change `base: "/gaauravlath/"` to `base: "/"`
2. Repository name: Rename to `gaauravmlath.github.io`

### Features

✅ Neural network visualization with interactive nodes  
✅ Animated particles and smooth transitions  
✅ Responsive design (mobile, tablet, desktop)  
✅ First-visit loading animation  
✅ All professional data included  
✅ Contact information with working links  
✅ Automatic GitHub Pages deployment  

### Troubleshooting

**Blank page after deployment?**
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Check browser console (F12) for errors
- Verify GitHub Pages is enabled in Settings → Pages

**Assets not loading?**
- Check that asset paths in `dist/public/index.html` start with `/gaauravlath/`
- Verify `dist/public/assets/` folder exists with CSS and JS files

**GitHub Actions not running?**
- Check the Actions tab in your repository
- Ensure `.github/workflows/deploy.yml` is in the main branch
- Review workflow logs for errors

### Customization

To customize the portfolio:

1. **Edit content:** Modify components in `src/components/`
2. **Update styles:** Edit `src/index.css` for global styles
3. **Change colors:** Update Tailwind configuration in `tailwind.config.js`
4. **Add new sections:** Create new components and add routes in `src/App.tsx`

After changes:
```bash
pnpm exec vite build
git add .
git commit -m "Update portfolio"
git push origin main
```

GitHub Actions will automatically rebuild and deploy!

### Local Development

```bash
# Start dev server
pnpm dev

# Open http://localhost:3000 in your browser
```

### Build for Production

```bash
# Build optimized production bundle
pnpm exec vite build

# Output goes to dist/public/
```

### Testing

```bash
# Run tests
pnpm test
```

### Support

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

---

**Ready to deploy?** Just push to your repository and GitHub Actions will handle the rest!
