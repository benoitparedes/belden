# EMEA Solution Team Meeting (Lyon) — GitHub Pages site

This is a lightweight, single-page site to share:
- Agenda (loaded from `agenda.json`)
- Location (Belden office in Lyon)
- Microsoft Forms link for Wednesday dinner choice

## Important note about the password gate
The password gate is **client-side only** (JavaScript). It prevents casual access but it is **not secure** for confidential information.

If you need real protection, put an access gateway in front of the site (SSO / VPN / reverse proxy).

## Run locally
Because the agenda is loaded via `fetch()`, you must serve the folder with a local web server:

### Option A (Python)
```bash
python -m http.server 8000
```
Then open: http://localhost:8000

### Option B (VS Code)
Install the “Live Server” extension and click “Go Live”.

## Publish on GitHub Pages
1. Create a new repository (e.g. `emea-solution-lyon-meeting`)
2. Upload all files from this folder to the repo root
3. Settings → Pages → Build and deployment → Deploy from a branch
4. Select `main` and `/ (root)`

## Update the agenda
Edit the Excel and re-export the JSON, or directly edit `agenda.json`.

Password: `emeasolution`
