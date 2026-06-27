# Hotel ERP Demo (React + Vite)

Integrated hotel ERP / PMS demo built with React, React Router, and in-memory demo data.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:5173` — demo login password: `demo`

## GitHub Pages

This app is configured for project-site hosting at:

**https://techknomatic-mukund.github.io/hms/**

### One-time GitHub setup

1. Push this repo to GitHub (`techknomatic-mukund/hms`).
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions** (not “Deploy from a branch”).
4. Push to `main`, `master`, or `muknd` — the workflow builds `website/` and publishes automatically.
5. Open the **Actions** tab and confirm **Deploy to GitHub Pages** completed successfully.

After the workflow finishes, the site is live at the URL above.

### Test production build locally

```bash
npm run preview:pages
```

Then open the URL shown in the terminal (paths use the `/hms/` base, same as GitHub Pages).

## If the repo name changes

Update the base path in `vite.config.js` (`GITHUB_PAGES_BASE`) and `homepage` in `package.json` to match the new repo name.
