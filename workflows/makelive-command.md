# /makelive Command Workflow

**Purpose:** Deploy any project to Vercel with one command

**Trigger:** When Chad says `/makelive` after asking to build something

---

## What /makelive Does (Automatically):

### 1. Create/Update GitHub Repo
- Check if repo exists for project
- If not: create new repo
- If yes: use existing repo
- Commit and push all changes

### 2. Connect to Vercel (if not connected)
- Link GitHub repo to Vercel project
- Enable auto-deploy on push
- Configure production branch (main)

### 3. Deploy to Vercel
- Trigger production deployment via API
- Use Vercel token: `credentials/vercel-token.txt`
- Wait for deployment to complete

### 4. Return Live URL
- Report deployment status
- Provide live URL
- Confirm auto-deploy is active for future pushes

---

## Execution Steps:

```bash
# 1. Commit and push to GitHub
cd [PROJECT_DIR]
git add -A
git commit -m "[COMMIT_MESSAGE]"
git push origin main

# 2. Get repo ID
REPO_ID=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/pacinobot2026/[REPO_NAME] | jq -r '.id')

# 3. Deploy to Vercel
curl -X POST "https://api.vercel.com/v13/deployments" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "[PROJECT_NAME]",
    "gitSource": {
      "type": "github",
      "repo": "pacinobot2026/[REPO_NAME]",
      "ref": "main",
      "repoId": REPO_ID
    },
    "target": "production"
  }'

# 4. Extract and return URL
```

---

## Response Format:

```
✅ /makelive COMPLETE

📦 GitHub: https://github.com/pacinobot2026/[REPO_NAME]
🚀 Deploying to Vercel...
⏳ Status: BUILDING

🌐 Live URL: https://[PROJECT_NAME]-pacino-bots-projects.vercel.app

Auto-deploy: ✅ ENABLED (future pushes will auto-deploy)
```

---

## Token Locations:
- **Vercel:** `credentials/vercel-token.txt`
- **GitHub:** `vizard-clips-app/.env.local` (GITHUB_TOKEN)

---

## Error Handling:

**If repo doesn't exist:**
- Create it via GitHub API
- Initialize git, add remote, push

**If Vercel project doesn't exist:**
- First deployment will create the project
- Auto-link to GitHub repo

**If deployment fails:**
- Report error
- Show deployment logs URL
- Suggest manual check in Vercel dashboard

---

**Created:** 2026-02-25  
**Author:** Pacino
