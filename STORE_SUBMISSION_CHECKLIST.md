# Chrome Web Store Submission Checklist

Quick reference checklist for submitting the extension.

## ✅ Code Ready
- [x] All code files complete
- [x] Icons present (16x16, 48x48, 128x128)
- [x] Manifest.json configured
- [x] Error handling in place
- [x] Privacy policy created (`PRIVACY_POLICY.md`)

## 📋 Before Submission

### 1. Account Setup
- [ ] Create Google account (if needed)
- [ ] Pay $5 Chrome Web Store Developer registration fee
- [ ] Complete developer account setup at https://chrome.google.com/webstore/devconsole

### 2. Assets Needed
- [ ] **Screenshots** (at least 1, up to 5)
  - Extension popup showing settings
  - Options page
  - Badge with duplicate count
  - Before/after closing duplicates
  - Recommended size: 1280x800 or 640x400

- [ ] **Privacy Policy Hosting**
  - Host `PRIVACY_POLICY.md` publicly
  - Options: GitHub Pages, your website, or GitHub repo (raw file)
  - Get public URL for store listing

### 3. Package Preparation
- [ ] Create zip file excluding:
  - `.git/` folder
  - `README.md`, `PUBLISHING_GUIDE.md`, `STORE_SUBMISSION_CHECKLIST.md`
  - `create-icons.html`, `ICON_SPECS.md`
  - Any test files

- [ ] Verify zip contains:
  - `manifest.json`
  - `background.js`
  - `popup.html`, `popup.css`, `popup.js`
  - `options.html`, `options.css`, `options.js`
  - `icons/` folder with all icons

### 4. Store Listing Content
- [ ] **Name**: Close Duplicate Tabs (Including Anchors)
- [ ] **Summary**: 132 characters max
- [ ] **Description**: Detailed description (see PUBLISHING_GUIDE.md)
- [ ] **Category**: Productivity
- [ ] **Language**: English
- [ ] **Privacy Policy URL**: [Your hosted URL]
- [ ] **Screenshots**: Upload at least 1

### 5. Permissions Justification
- [ ] Prepare explanation for `tabs` permission
- [ ] Prepare explanation for `storage` permission
- [ ] Single purpose declaration ready

## 🚀 Submission Steps

1. [ ] Go to Chrome Web Store Developer Dashboard
2. [ ] Click "New Item"
3. [ ] Upload zip file
4. [ ] Fill in all store listing fields
5. [ ] Upload screenshots
6. [ ] Add privacy policy URL
7. [ ] Review all information
8. [ ] Submit for review

## ⏱️ Timeline

- **Preparation**: 1-2 days (screenshots, privacy policy hosting)
- **Submission**: 30 minutes
- **Review**: 1-3 business days
- **Total**: ~1 week

## 📚 Resources

- Full guide: `PUBLISHING_GUIDE.md`
- Privacy policy: `PRIVACY_POLICY.md`
- [Chrome Web Store Policies](https://developer.chrome.com/docs/webstore/program-policies/)

## 🎯 Quick Tips

1. **Screenshots are critical** - Make them clear and show the extension working
2. **Privacy policy must be accessible** - Test the URL before submitting
3. **Be specific in description** - Explain exactly what the extension does
4. **Justify permissions** - Explain why each permission is needed

Good luck! 🎉

