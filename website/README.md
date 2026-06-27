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
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose branch **`gh-pages`**, folder **`/ (root)`**, then **Save**.
5. Push to `main`, `master`, or `muknd` — the workflow builds `website/` and pushes the output to `gh-pages`.
6. Open **Actions** and confirm **Deploy to GitHub Pages** completes (green check).

After the first successful run, wait 1–2 minutes and open the live URL.

**If a workflow run fails in ~2 seconds:** Pages was likely set to “GitHub Actions” instead of the `gh-pages` branch — switch to **Deploy from a branch** as above, then re-run the workflow from the Actions tab.

### Test production build locally

```bash
npm run preview:pages
```

Then open the URL shown in the terminal (paths use the `/hms/` base, same as GitHub Pages).

## If the repo name changes

Update the base path in `vite.config.js` (`GITHUB_PAGES_BASE`) and `homepage` in `package.json` to match the new repo name.
