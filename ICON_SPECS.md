# Icon Specifications

Your Chrome Extension needs **3 icon sizes** in PNG format:

## Required Icons

1. **`icon16.png`** - 16×16 pixels
   - Used in: Chrome toolbar (when extension is pinned)
   - Smallest size, needs to be clear and recognizable

2. **`icon48.png`** - 48×48 pixels  
   - Used in: Chrome Extensions management page (`chrome://extensions/`)
   - Medium size, more detail visible

3. **`icon128.png`** - 128×128 pixels
   - Used in: Chrome Web Store (if you publish it)
   - Largest size, can show the most detail

## File Location

All icons should be placed in the `icons/` folder:
```
icons/
  ├── icon16.png
  ├── icon48.png
  └── icon128.png
```

## Design Guidelines

### Best Practices:
- **Simple & recognizable**: Icons are small, especially the 16px version
- **High contrast**: Should be visible on both light and dark toolbars
- **Square format**: Chrome will display them as squares
- **No text**: Avoid text in icons (especially in 16px version) - it becomes unreadable
- **Consistent style**: All three sizes should look like the same icon, just scaled

### Design Ideas for "Close Duplicate Tabs":
- **X with tabs**: An X overlaying multiple tabs/layers
- **Merge symbol**: Two overlapping tabs/circles merging into one
- **Duplicate indicator**: Two identical shapes with an X or minus sign
- **Clean/minimal**: Simple geometric shapes that represent "duplicates" or "close"

### Color Suggestions:
- **Expensify brand colors**: If you want to match Expensify's brand
- **Blue/Red**: Blue for action, red for "close" or "remove"
- **Monochrome**: Simple black/white/gray for a clean look

## Tools to Create Icons

1. **Design Tools**:
   - Figma (free, web-based)
   - Adobe Illustrator/Photoshop
   - Sketch (Mac)
   - Canva (simple, web-based)

2. **Icon Generators**:
   - [Favicon.io](https://favicon.io/) - Generate from text or image
   - [RealFaviconGenerator](https://realfavicongenerator.net/)
   - [IconKitchen](https://icon.kitchen/) - Google's icon generator

3. **Quick Method**:
   - Create one 128×128px icon
   - Scale it down to 48×48px and 16×16px
   - Make sure the 16px version is still recognizable (may need to simplify)

## Testing

After adding icons:
1. Reload the extension in `chrome://extensions/`
2. Pin the extension to your toolbar to see the 16px icon
3. Check the extensions page to see the 48px icon
4. Verify the badge (red number) is visible on your icon

## Temporary Solution

If you want to test quickly, you can use the `create-icons.html` file:
1. Open `create-icons.html` in Chrome
2. Click each "Download icon..." button
3. Move the downloaded files to the `icons/` folder
4. Reload the extension

These will be simple placeholder icons with an "E" - you can replace them with your custom design later!

