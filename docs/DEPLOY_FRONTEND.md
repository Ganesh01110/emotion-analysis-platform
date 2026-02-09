# Frontend Deployment Guide (Next.js)

For your Next.js frontend, you have two excellent options:

## Option 1: Vercel (Recommended 🌟)
Vercel is the creator of Next.js and provides the best performance and easiest setup.

### Steps:
1.  Go to [Vercel.com](https://vercel.com) and sign up with GitHub.
2.  Click **New Project** and import your `emotion-analysis-platform` repository.
3.  **Root Directory**: Set this to `frontend`.
4.  **Framework Preset**: Select `Next.js`.
5.  **Environment Variables**: Add the following:
    *   `NEXT_PUBLIC_API_URL`: The URL of your backend (e.g., your Hugging Face Space URL).
    *   `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase API key.
    *   *(Add all other Firebase variables from your local `.env`) *
6.  Click **Deploy**.

---

## Option 2: Hugging Face Spaces (Docker)
If you want to keep everything in one place, you can host the frontend as its own Space.

### Steps:
1.  Create a **new Space** on Hugging Face.
2.  Select **Docker** as the Space SDK and **Blank** template.
3.  Add GitHub Secrets:
    *   `HF_TOKEN`: (Same as backend)
    *   `HF_USERNAME`: (Same as backend)
    *   `HF_FRONTEND_SPACE_NAME`: The name of your **frontend** Space.
4.  **Syncing**: I have created [.github/workflows/hf-frontend-sync.yml](file:///c:/Users/sahug/OneDrive/Desktop/ganeshdocs/antigravity/EmotionanalysisProject/.github/workflows/hf-frontend-sync.yml) which will automatically push your frontend to this Space.

### Port Note:
Hugging Face uses port **7860**. I have already updated your `frontend/Dockerfile` and `next.config.ts` to support this.
