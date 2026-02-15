# Push to GitHub Instructions

Your repo: https://github.com/human-kan/learner.git

## Option 1: Using Personal Access Token (Recommended)

### 1. Create GitHub Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it: "AI Learning Hub"
4. Select scopes: **repo** (all checkboxes under repo)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)

### 2. Push to GitHub
```bash
cd /root/clawd/ai-learning-hub

# Push using token (replace YOUR_TOKEN)
git push https://YOUR_TOKEN@github.com/human-kan/learner.git main

# Push tags too
git push https://YOUR_TOKEN@github.com/human-kan/learner.git --tags
```

---

## Option 2: Using SSH Key

### 1. Generate SSH Key
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter for all prompts (default location, no passphrase)
```

### 2. Add SSH Key to GitHub
```bash
# Copy your public key
cat ~/.ssh/id_ed25519.pub
```

1. Go to: https://github.com/settings/keys
2. Click "New SSH key"
3. Title: "AI Learning Hub Server"
4. Paste the key
5. Click "Add SSH key"

### 3. Change Remote to SSH
```bash
cd /root/clawd/ai-learning-hub
git remote set-url origin git@github.com:human-kan/learner.git
git push -u origin main
git push origin --tags
```

---

## Option 3: Manual Upload (Last Resort)

1. Go to: https://github.com/human-kan/learner
2. Click "uploading an existing file"
3. Drag the entire `/root/clawd/ai-learning-hub` folder
4. Commit changes

---

## Verify Push

After pushing, verify at:
https://github.com/human-kan/learner

You should see:
- 7 commits
- Tag: v0.1.0-MVP
- All folders: backend, frontend, database, docs
- README.md visible on main page

---

## Quick Command (Copy-Paste)

**Replace YOUR_TOKEN with your actual token:**

```bash
cd /root/clawd/ai-learning-hub && \
git push https://YOUR_TOKEN@github.com/human-kan/learner.git main && \
git push https://YOUR_TOKEN@github.com/human-kan/learner.git --tags && \
echo "✅ Pushed successfully!"
```

---

**Need help?** Let me know if you get any errors!
