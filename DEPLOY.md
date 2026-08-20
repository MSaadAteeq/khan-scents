# Deploy Khan Scents on Render (Frontend + Backend separate)

This guide deploys **two Render services** from one GitHub repo:

| Service | Type | Folder | URL example |
|---------|------|--------|-------------|
| Frontend | **Static Site** | `client/` | `https://khan-scents.onrender.com` |
| Backend | **Web Service** | `server/` | `https://khan-scents-api.onrender.com` |

---

## Step 1 — Push code to GitHub

1. Create a repo on GitHub (e.g. `khan-scents`).
2. From your project folder:

```bash
cd d:\khan-scents
git init
git add .
git commit -m "Initial Khan Scents store"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/khan-scents.git
git push -u origin main
```

---

## Step 2 — Deploy the backend (API)

1. Go to [render.com](https://render.com) → **Sign up / Log in**.
2. Click **New +** → **Web Service**.
3. Connect your GitHub account and select the `khan-scents` repo.
4. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `khan-scents-api` |
| **Region** | Singapore (closest to Pakistan) or Frankfurt |
| **Root Directory** | `server` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

5. **Environment Variables** (add these):

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `CLIENT_URL` | `https://YOUR-FRONTEND-NAME.onrender.com` *(update after Step 3)* |

6. Click **Create Web Service**.
7. Wait for deploy. Test: open `https://khan-scents-api.onrender.com/api/health`  
   You should see: `{"status":"ok",...}`

**Copy your backend URL** — you'll need it for the frontend.

---

## Step 3 — Deploy the frontend (Static Site)

1. **New +** → **Static Site**.
2. Select the same GitHub repo.
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `khan-scents` |
| **Root Directory** | `client` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

4. **Environment Variables**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://khan-scents-api.onrender.com` *(your backend URL, no trailing slash)* |

5. Click **Create Static Site**.

6. **SPA routing** (required for `/shop`, `/product/...`, etc.):
   - In the static site dashboard → **Redirects/Rewrites**
   - Add rule: **Source** `/*` → **Destination** `/index.html` → **Action** `Rewrite`

   *(The repo includes `client/public/_redirects` which Render may pick up automatically.)*

7. Wait for deploy. Open your frontend URL.

---

## Step 4 — Link frontend ↔ backend

1. Go back to **backend** service → **Environment**.
2. Set `CLIENT_URL` to your exact frontend URL, e.g.:
   ```
   https://khan-scents.onrender.com
   ```
3. **Save** — Render will redeploy the API.

4. Hard-refresh the frontend (`Ctrl+Shift+R`) and test:
   - Shop page loads products
   - Add to cart works
   - Checkout places order + opens WhatsApp

---

## Step 5 — Custom domain (optional)

**Frontend:**
- Static Site → **Settings** → **Custom Domains** → add `www.khanscents.com`
- Update DNS at your registrar (Render shows the records)

**Backend:**
- Web Service → **Custom Domains** → e.g. `api.khanscents.com`
- Update `VITE_API_URL` on frontend to `https://api.khanscents.com`
- Update `CLIENT_URL` on backend to `https://www.khanscents.com`

---

## Important notes

### Free tier cold starts
Render free services **sleep after 15 min** of inactivity. First visit may take 30–60 seconds to wake up.

### Orders storage
Orders are saved in `server/data/orders.json`. On Render's free tier, **this file resets when the service redeploys**. For production, consider:
- Render **Persistent Disk** (paid), or
- A database (MongoDB Atlas free tier, Supabase, etc.)

### Local development
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- No `VITE_API_URL` needed locally — Vite proxies `/api` to the server.

### Troubleshooting

| Problem | Fix |
|---------|-----|
| Shop shows "Failed to load products" | Check `VITE_API_URL` on frontend; wake up backend by visiting `/api/health` |
| CORS error in browser console | Set `CLIENT_URL` on backend to exact frontend URL (no trailing slash) |
| 404 on `/shop` refresh | Add SPA rewrite rule `/* → /index.html` |
| Images broken | Ensure `client/public/images/` is committed to Git |

---

## Quick checklist

- [ ] Code pushed to GitHub
- [ ] Backend Web Service live (`/api/health` works)
- [ ] Frontend Static Site live
- [ ] `VITE_API_URL` set on frontend
- [ ] `CLIENT_URL` set on backend
- [ ] SPA rewrite rule added
- [ ] Test full checkout flow

Your store is live.
