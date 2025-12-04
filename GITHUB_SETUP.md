# GitHub Repository Setup

Quick guide to create and push this extension to GitHub.

## Option 1: Using GitHub Web Interface

1. Go to https://github.com/new
2. Repository name: `close-duplicate-tabs` (or your preferred name)
3. Description: "Chrome Extension to close duplicate tabs, including those with different anchors"
4. Set to **Public** (for open source)
5. **Don't** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Option 2: Using GitHub CLI

If you have GitHub CLI installed:

```bash
gh repo create close-duplicate-tabs --public --description "Chrome Extension to close duplicate tabs, including those with different anchors"
```

## Initial Git Setup & Push

After creating the repo, run these commands in this directory:

```bash
# Initialize git (if not already initialized)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Close Duplicate Tabs Chrome Extension"

# Add remote (replace YOUR_USERNAME with twisterdotcom)
git remote add origin https://github.com/twisterdotcom/close-duplicate-tabs.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Repository Settings to Configure

After pushing, go to your repo settings on GitHub:

1. **Settings → General → Features**
   - Enable Issues
   - Enable Discussions (optional)
   - Enable Wiki (optional)

2. **Settings → Pages** (if you want to host privacy policy)
   - Source: Deploy from a branch
   - Branch: `main` / `docs` folder
   - Or use GitHub Pages to host `PRIVACY_POLICY.md`

3. **Add Topics** (on the repo main page)
   - `chrome-extension`
   - `browser-extension`
   - `productivity`
   - `tabs`
   - `javascript`

## Privacy Policy URL for Chrome Web Store

Once the repo is public, you can use one of these URLs for the Chrome Web Store privacy policy:

- **Raw GitHub file**: `https://raw.githubusercontent.com/twisterdotcom/close-duplicate-tabs/main/PRIVACY_POLICY.md`
- **GitHub Pages** (if you set it up): `https://twisterdotcom.github.io/close-duplicate-tabs/PRIVACY_POLICY.md`
- **GitHub repo page**: `https://github.com/twisterdotcom/close-duplicate-tabs/blob/main/PRIVACY_POLICY.md`

The raw file URL is usually the best option as it's clean and direct.

## Next Steps After GitHub Setup

1. ✅ Repository is public
2. ✅ Privacy policy is accessible
3. 📸 Take screenshots for Chrome Web Store
4. 🚀 Submit to Chrome Web Store (see `PUBLISHING_GUIDE.md`)
