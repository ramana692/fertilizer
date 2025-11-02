# Fertilizer Platform - Frontend

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run locally (expects backend at http://localhost:5001):
   ```bash
   npm start
   ```

## Environment variables

This app reads its backend base URL from the environment variable `REACT_APP_API_URL` at build time.

- Local development (optional): create a `.env` file in `fertilizer-platform/` with
  ```
  REACT_APP_API_URL=http://localhost:5001
  ```
- Production: set `REACT_APP_API_URL` to your backend URL, for example the Render deployment:
  ```
  REACT_APP_API_URL=https://fertilizer-c92p.onrender.com
  ```

If this variable is not set during a production build, the app will fall back to `https://fertilizer-c92p.onrender.com`. During local development it falls back to `http://localhost:5001`.

## Deploy notes

- Netlify: already configured via `netlify.toml` in repo (build base `fertilizer-platform`, publish `build`, env `REACT_APP_API_URL`).
- Vercel / Cloudflare Pages: set `REACT_APP_API_URL` in project environment variables, build command `npm run build`, output directory `build` (root `fertilizer-platform`).
