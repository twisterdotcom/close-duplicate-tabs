# Chrome Web Store Publishing Guide

This guide outlines everything needed to publish "Close Duplicate Tabs (Including Anchors)" to the Chrome Web Store.

## Prerequisites

1. **Google Account** - You'll need a Google account
2. **Developer Account** - One-time $5 registration fee for Chrome Web Store Developer Program
   - Go to: https://chrome.google.com/webstore/devconsole
   - Pay the one-time registration fee
   - Complete developer account setup

## Required Assets

### ✅ Already Complete
- [x] Extension icons (16x16, 48x48, 128x128)
- [x] Manifest.json configured
- [x] All code files

### 📝 Still Needed

1. **Screenshots** (Required)
   - **At least 1 screenshot** (1280x800 or 640x400 recommended)
   - **Up to 5 screenshots** showing:
     - Extension popup interface
     - Options/settings page
     - Badge showing duplicate count
     - Before/after closing duplicates

2. **Promotional Images** (Optional but recommended)
   - Small promotional tile: 440x280
   - Large promotional tile: 920x680
   - Marquee promotional tile: 1400x560

3. **Privacy Policy** (Required)
   - ✅ Created: `PRIVACY_POLICY.md`
   - Must be hosted publicly (GitHub Pages, your website, etc.)
   - URL will be required in store listing

4. **Store Listing Content**
   - **Name**: "Close Duplicate Tabs (Including Anchors)" (or shorter)
   - **Short Description**: 132 characters max
   - **Detailed Description**: Up to 16,000 characters
   - **Category**: Productivity
   - **Language**: English (and others if you want)

## Pre-Submission Checklist

### Code Review
- [x] No console.log statements with sensitive data
- [x] Error handling in place
- [x] Permissions are minimal and justified
- [x] Manifest version is correct
- [x] No hardcoded API keys or secrets

### Manifest.json Review
- [x] All required fields present
- [x] Permissions are minimal
- [x] Icons are properly referenced
- [x] Version number is set

### Privacy & Security
- [x] Privacy policy created
- [x] Privacy policy hosted publicly
- [x] No data collection beyond local storage
- [x] Permissions are clearly explained

## Step-by-Step Publishing Process

### 1. Prepare Your Extension Package

```bash
# Create a zip file of your extension (excluding unnecessary files)
zip -r close-duplicate-tabs.zip . \
  -x "*.git*" \
  -x "*.DS_Store" \
  -x "PUBLISHING_GUIDE.md" \
  -x "README.md" \
  -x "create-icons.html" \
  -x "ICON_SPECS.md"
```

**Files to include:**
- manifest.json
- background.js
- popup.html, popup.css, popup.js
- options.html, options.css, options.js
- icons/ (all icon files)

**Files to exclude:**
- .git/ and .gitignore
- README.md, PUBLISHING_GUIDE.md
- Development files (create-icons.html, etc.)
- Any test files

### 2. Create Store Listing

1. Go to https://chrome.google.com/webstore/devconsole
2. Click "New Item"
3. Upload your zip file
4. Fill in store listing details (see below)

### 3. Store Listing Details

#### Basic Information
- **Name**: Close Duplicate Tabs (Including Anchors)
- **Summary** (132 chars max):
  ```
  Close duplicate tabs including those with different anchors. Keeps the tab with the highest anchor number (e.g., latest GitHub comment).
  ```

#### Detailed Description (Suggested)
```
Close Duplicate Tabs (Including Anchors) helps you manage your browser tabs by automatically detecting and closing duplicate tabs, even when they have different anchors or hashes.

🎯 Key Features:
• Smart Duplicate Detection - Detects duplicate tabs even with different anchors/hashes
• Anchor Number Comparison - Automatically keeps the tab with the highest anchor number (perfect for GitHub comments)
• Case-Insensitive Matching - Handles URLs with different cases (e.g., Expensify vs expensify)
• Works with Suspended Tabs - Detects duplicates even in inactive tabs (Arc browser compatible)
• Configurable Options - Customize how duplicates are detected
• Visual Badge - See duplicate count at a glance

⚙️ Settings:
• Ignore query parameters when comparing URLs
• Ignore hash when comparing (but still uses it to determine which tab to keep)
• Option to reload remaining tabs after closing duplicates

📖 Example Use Case:
For GitHub issue tabs like:
• github.com/Expensify/Expensify/issues/573091
• github.com/Expensify/Expensify/issues/573091#issuecomment-3595795518
• github.com/Expensify/Expensify/issues/573091#issuecomment-3595796076

The extension will recognize these as duplicates and keep only the one with the highest comment number (#issuecomment-3595796076).

🔒 Privacy:
• All data stored locally on your device
• No data transmitted to external servers
• No tracking or analytics
• Open source and transparent

Perfect for developers, researchers, and anyone who manages many browser tabs!
```

#### Category
- **Primary**: Productivity
- **Secondary**: (Optional)

#### Language
- English (and add others if you want)

#### Privacy Policy URL
- Host `PRIVACY_POLICY.md` on GitHub Pages or your website
- Enter the public URL here

#### Screenshots
- Upload at least 1 screenshot (1280x800 recommended)
- Show the extension in action

### 4. Additional Information

#### Single Purpose Declaration
**What is the single purpose of your extension?**
> This extension's single purpose is to help users manage duplicate browser tabs by detecting and closing them, keeping the most relevant tab based on anchor numbers.

#### Permissions Justification
**Why does your extension need these permissions?**

- **`tabs` permission**: Required to query open tabs in the current window and close duplicate tabs. The extension only accesses tabs to compare URLs and does not store or transmit any tab data.

- **`storage` permission**: Required to save user preferences (settings) locally on the device. Only stores user's extension settings, no URLs or browsing data.

### 5. Review Process

After submission:
- **Initial Review**: Usually 1-3 business days
- **Review Status**: Check in Chrome Web Store Developer Dashboard
- **Common Issues**:
  - Privacy policy not accessible
  - Permissions not clearly justified
  - Screenshots missing or unclear
  - Description too vague

### 6. Post-Publication

- Monitor reviews and ratings
- Respond to user feedback
- Fix bugs and release updates
- Update version number in manifest.json for each release

## Version Updates

When updating:
1. Increment version in `manifest.json` (e.g., 1.0.0 → 1.0.1)
2. Create new zip file
3. Upload in Developer Dashboard
4. Add release notes describing changes

## Common Rejection Reasons

1. **Privacy Policy Issues**
   - Policy not accessible
   - Policy doesn't match extension behavior
   - Missing privacy policy URL

2. **Permission Issues**
   - Permissions not justified
   - Requesting unnecessary permissions

3. **Functionality Issues**
   - Extension doesn't work as described
   - Crashes or errors

4. **Store Listing Issues**
   - Poor screenshots
   - Vague description
   - Misleading claims

## Tips for Success

1. **Clear Description**: Be specific about what the extension does
2. **Good Screenshots**: Show the extension in action
3. **Privacy First**: Be transparent about data handling
4. **Test Thoroughly**: Make sure everything works before submitting
5. **Respond to Reviews**: Engage with users who leave feedback

## Estimated Timeline

- **Account Setup**: 1 day (including payment processing)
- **Preparation**: 1-2 days (screenshots, privacy policy hosting)
- **Submission**: 30 minutes
- **Review**: 1-3 business days
- **Total**: ~1 week from start to published

## Resources

- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- [Chrome Web Store Developer Program Policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [Manifest V3 Documentation](https://developer.chrome.com/docs/extensions/mv3/)
- [Privacy Policy Requirements](https://developer.chrome.com/docs/webstore/user-data/)

## Next Steps

1. ✅ Review and finalize code
2. ✅ Create privacy policy (done)
3. 📸 Take screenshots
4. 🌐 Host privacy policy publicly
5. 💳 Set up Chrome Web Store Developer account
6. 📦 Create extension zip file
7. 🚀 Submit to Chrome Web Store

Good luck with your submission!

