# Hugging Face Spaces Deployment Guide (Backend)

Hugging Face Spaces is an excellent platform for hosting your Python/FastAPI backend, especially since it uses AI models.

## 1. Create your Space
1. Go to [huggingface.co/new-space](https://huggingface.co/new-space).
2. **Name**: e.g., `emotion-analysis-api`.
3. **SDK**: Select **Docker**.
4. **Hardware**: "CPU Basic" is fine for DistilBERT, but "CPU Upgrade" or "T4 Small" will be faster.
5. **Visibility**: Public (or Private if you prefer).

## 2. Prepare GitHub Secrets
To automate the deployment from GitHub, add these to your GitHub Repo (**Settings > Secrets and variables > Actions**):

| Secret Name | Description | Where to get it |
| :--- | :--- | :--- |
| `HF_TOKEN` | Hugging Face Write Token | [HF Settings > Tokens](https://huggingface.co/settings/tokens) |
| `HF_USERNAME` | Your HF Username | Your profile name |
| `HF_SPACE_NAME` | The name of your Space | The name you chose in Step 1 |

## 3. Deployment Methods

### Method A: Automated Sync (Recommended)
This method automatically pushes your `backend/` folder to the Hugging Face Space whenever you push to GitHub.

I have created a new workflow file for this: [.github/workflows/hf-sync.yml](file:///.github/workflows/hf-sync.yml).

### Method B: Manual Push (CLI)
If you prefer to push manually:
```bash
# In your backend directory
git remote add hf https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME
git push hf main
```

## 4. Environment Variables in HF
In your Hugging Face Space, go to **Settings > Variables and secrets** and add:
- `ENCRYPTION_KEY`: Your 32-character key.
- `DATABASE_URL`: Your production database URL (or leave blank to use the default SQLite).

## 5. Port Information
Hugging Face Spaces uses port **7860** by default. I have already updated your `backend/Dockerfile` to use this port for you.
