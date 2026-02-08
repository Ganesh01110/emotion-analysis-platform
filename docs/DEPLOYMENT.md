# 🚀 Deployment Guide

## 1. Does it deploy automatically?

**Not yet!** Pushing to GitHub currently runs your **CI/CD Pipeline** (Continuous Integration/Continuous Deployment), which:
1.  **Tests** your code (runs `npm run lint`, `pytest`)
2.  **Builds** your application to check for errors
3.  **Does NOT** deploy to a live server (Vercel/AWS/Render) because we haven't given GitHub permission to access your accounts yet.

---

## 2. Is Redis Necessary?

**Yes, highly recommended.**
-   **Why?** AI analysis (BERT model) is "heavy". If 10 people analyze thoughts at once, your server would crash without Redis.
-   **What it does:** It creates a "line" (queue). Users submit requests -> Redis holds them -> AI processes them one by one.
-   **Can I remove it?** For a demo/portfolio, yes. But for a real app, keep it. Code is currently set up to use it.

---

## 3. Step-by-Step Deployment Instructions

We will deploy the **Frontend to Vercel** (Easiest) and **Backend to Render** (Free & supports Docker).

### Part A: Deploy Frontend (Vercel)

1.  **Push your code to GitHub**
    ```bash
    git add .
    git commit -m "Ready for deploy"
    git push origin master
    ```

2.  **Go to [Vercel.com](https://vercel.com)** and request an account if you don't have one.
3.  **Click "Add New..." -> "Project"**
4.  **Import your GitHub Repository** (`EmotionanalysisProject`)
5.  **Configure Project:**
    -   **Framework Preset:** Next.js
    -   **Root Directory:** `frontend` (Click "Edit" and select the `frontend` folder)
    -   **Environment Variables:** Copy everything from `frontend/.env.local`
        -   `NEXT_PUBLIC_API_URL` -> (Leave blank for now, update after backend deploy)
        -   `NEXT_PUBLIC_FIREBASE_API_KEY` -> ...
        -   (Add all others)

6.  **Click "Deploy"**
    -   Vercel will build and deploy your site.
    -   You'll get a URL like `https://emotion-analysis.vercel.app`.

---

### Part B: Deploy Backend (Render.com)

1.  **Go to [Render.com](https://render.com)**
2.  **Click "New +" -> "Web Service"**
3.  **Connect GitHub** and select your repo.
4.  **Settings:**
    -   **Name:** `emotion-backend`
    -   **Root Directory:** `backend`
    -   **Runtime:** Docker
    -   **Region:** Oregon (US West) or Frankfurt (EU) - pick closest.
    -   **Instance Type:** Free

5.  **Environment Variables:**
    -   Copy everything from `backend/.env`
    -   **Important:** Update `DATABASE_URL` if using a cloud DB (see below).
    -   **Encryption Key:** Use the one we generated.
    -   **Firebase Keys:** Add your Firebase Admin setup.

6.  **Click "Create Web Service"**
    -   Render will build the Docker container.
    -   You'll get a URL like `https://emotion-backend.onrender.com`.

---

### Part C: Connect Them

1.  **Update Frontend Config:**
    -   Go back to Vercel > Settings > Environment Variables.
    -   Edit `NEXT_PUBLIC_API_URL` to your **Render Backend URL** (e.g., `https://emotion-backend.onrender.com`).
    -   **Redeploy** Vercel (Go to Deployments > Redeploy).

2.  **Update Backend Config:**
    -   Go to Render > Environment.
    -   Add/Edit `FRONTEND_URL` to your **Vercel Frontend URL** (e.g., `https://emotion-analysis.vercel.app`).
    -   Render triggers a new deploy automatically.

---

## 4. GitHub Actions (Automated Deployment)

If you want GitHub to deploy **automatically** when you push, you need to verify the Vercel/Render integrations provided in the steps above.

-   **Vercel:** automatically sets up a "hook". When you push to `master`, Vercel deploys.
-   **Render:** automatically sets up a "hook". When you push to `master`, Render deploys.

**You don't need complex GitHub Actions YAML files for this.** The platforms handle it for you!
