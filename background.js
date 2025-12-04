// Background service worker for Close Duplicate Tabs extension

console.log('Close Duplicate Tabs extension background service worker loaded');

// Initialize default settings on install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extension installed');
    chrome.storage.local.set({
      ignoreQuery: true,
      ignoreHash: true,
      reloadTabs: false
    });
  } else if (details.reason === 'update') {
    console.log('Extension updated');
  }
  // Update badge on install/update
  updateBadge();
});

// Update badge when extension starts
updateBadge();

// Handle extension icon click - run deduplication directly
chrome.action.onClicked.addListener(async () => {
  try {
    const settings = await chrome.storage.local.get(['ignoreQuery', 'ignoreHash', 'reloadTabs']);
    const ignoreQuery = settings.ignoreQuery !== false; // default to true
    const ignoreHash = settings.ignoreHash !== false; // default to true
    const reloadTabs = settings.reloadTabs === true;
    
    const result = await closeDuplicates(ignoreQuery, ignoreHash, reloadTabs);
  } catch (error) {
    console.error('Error closing duplicates on click:', error);
  }
});

// Count duplicate tabs
async function countDuplicates() {
  try {
    const settings = await chrome.storage.local.get(['ignoreQuery', 'ignoreHash']);
    const ignoreQuery = settings.ignoreQuery !== false; // default to true
    const ignoreHash = settings.ignoreHash !== false; // default to true
    
    // Get all tabs in the current window with URLs loaded (handles suspended tabs)
    const tabs = await getAllTabsWithUrls();
    
    if (tabs.length <= 1) {
      return 0;
    }
    
    // Group tabs by normalized URL
    const tabGroups = new Map();
    
    tabs.forEach(tab => {
      // Skip invalid or special URLs
      if (!isValidUrl(tab.url)) {
        return;
      }
      
      const normalizedUrl = normalizeUrl(tab.url, ignoreQuery, ignoreHash);
      
      // Skip invalid normalized URLs (they won't match anything anyway)
      if (normalizedUrl.startsWith('__invalid__') || normalizedUrl.startsWith('__error__')) {
        return;
      }
      
      if (!tabGroups.has(normalizedUrl)) {
        tabGroups.set(normalizedUrl, []);
      }
      
      tabGroups.get(normalizedUrl).push(tab);
    });
    
    // Count duplicates (tabs that would be closed)
    let duplicateCount = 0;
    
    tabGroups.forEach((groupTabs) => {
      if (groupTabs.length > 1) {
        // All but one are duplicates
        duplicateCount += groupTabs.length - 1;
      }
    });
    
    return duplicateCount;
  } catch (error) {
    console.error('Error counting duplicates:', error);
    return 0;
  }
}

// Update the badge text
async function updateBadge() {
  const duplicateCount = await countDuplicates();
  
  if (duplicateCount > 0) {
    // Set badge text (max 4 characters, Chrome will show "99+" for larger numbers)
    chrome.action.setBadgeText({ text: duplicateCount.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#FF4444' }); // Red badge
  } else {
    // Clear badge when no duplicates
    chrome.action.setBadgeText({ text: '' });
  }
}

// Update badge when tabs are created, updated, or removed
chrome.tabs.onCreated.addListener(() => {
  updateBadge();
});

chrome.tabs.onUpdated.addListener(() => {
  updateBadge();
});

chrome.tabs.onRemoved.addListener(() => {
  updateBadge();
});

chrome.tabs.onActivated.addListener(() => {
  updateBadge();
});

// Also update badge when window focus changes (user switches windows)
chrome.windows.onFocusChanged.addListener(() => {
  updateBadge();
});

// Check if URL is valid and processable
function isValidUrl(url) {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return false;
  }
  
  // Skip special Chrome URLs
  if (url.startsWith('chrome://') || 
      url.startsWith('chrome-extension://') ||
      url.startsWith('about:') ||
      url.startsWith('edge://') ||
      url.startsWith('moz-extension://')) {
    return false;
  }
  
  // Check if it's a valid URL format
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

// Ensure tab has a URL loaded (handles suspended/inactive tabs in Arc)
async function ensureTabUrl(tab) {
  // If tab already has a valid URL, return it
  if (tab.url && isValidUrl(tab.url)) {
    return tab.url;
  }
  
  // Try to get the tab's full information, which may force-load it
  // This helps with browsers like Arc that suspend inactive tabs
  try {
    const fullTab = await chrome.tabs.get(tab.id);
    if (fullTab.url && isValidUrl(fullTab.url)) {
      return fullTab.url;
    }
  } catch (e) {
    // Tab might have been closed or we don't have permission
    console.warn(`Could not load URL for tab ${tab.id}:`, e);
  }
  
  // Return the original URL (might be empty/invalid, but that's handled elsewhere)
  return tab.url || '';
}

// Get all tabs with their URLs loaded (handles suspended tabs)
async function getAllTabsWithUrls() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  
  // For tabs without URLs, try to load them
  // This is especially important for Arc browser which suspends inactive tabs
  const tabsWithUrls = await Promise.all(
    tabs.map(async (tab) => {
      const url = await ensureTabUrl(tab);
      return { ...tab, url };
    })
  );
  
  return tabsWithUrls;
}

// Normalize URL for comparison
function normalizeUrl(url, ignoreQuery, ignoreHash) {
  // Validate URL first
  if (!isValidUrl(url)) {
    // Return a unique identifier for invalid URLs so they don't match anything
    return `__invalid__${url}`;
  }
  
  try {
    const urlObj = new URL(url);
    
    // Normalize hostname to lowercase (domains are case-insensitive)
    urlObj.hostname = urlObj.hostname.toLowerCase();
    
    // Normalize pathname to lowercase (most web servers treat paths as case-insensitive)
    // This handles cases like GitHub where repository names are case-insensitive
    urlObj.pathname = urlObj.pathname.toLowerCase();
    
    // Remove hash if ignoring it
    if (ignoreHash) {
      urlObj.hash = '';
    }
    
    // Remove query if ignoring it
    if (ignoreQuery) {
      urlObj.search = '';
    }
    
    // Normalize default index files
    const pathname = urlObj.pathname
      .replace(/\/index\.(html|htm|xhtml|php|cgi|aspx)$/i, '/')
      .replace(/\/$/, '/');
    
    urlObj.pathname = pathname;
    
    return urlObj.toString();
  } catch (e) {
    // Fallback for any unexpected errors
    console.error('Error normalizing URL:', e, url);
    return `__error__${url}`;
  }
}

// Extract number from anchor/hash
function extractAnchorNumber(url) {
  // Validate URL first
  if (!isValidUrl(url)) {
    return 0;
  }
  
  try {
    const urlObj = new URL(url);
    const hash = urlObj.hash;
    
    if (!hash) {
      return 0; // No anchor, treat as base (lowest priority)
    }
    
    // Extract all numbers from the hash
    const numbers = hash.match(/\d+/g);
    if (!numbers || numbers.length === 0) {
      return 0;
    }
    
    // Get the largest number found in the hash
    // For GitHub: #issuecomment-3595795518 -> 3595795518
    const maxNumber = Math.max(...numbers.map(n => parseInt(n, 10)));
    return maxNumber;
  } catch (e) {
    return 0;
  }
}

// Compare tabs to determine which to keep
function compareTabs(tab1, tab2, ignoreHash) {
  const num1 = extractAnchorNumber(tab1.url);
  const num2 = extractAnchorNumber(tab2.url);
  
  // If ignoring hash, we still want to keep the one with the highest anchor number
  // But if both have no anchor or same number, keep the most recently accessed
  if (num1 > num2) {
    return -1; // tab1 should be kept
  } else if (num2 > num1) {
    return 1; // tab2 should be kept
  } else {
    // Same anchor number (or both 0), keep the most recently accessed
    return tab2.lastAccessed - tab1.lastAccessed;
  }
}

// Close duplicate tabs
async function closeDuplicates(ignoreQuery, ignoreHash, reloadTabs) {
  try {
    // Get all tabs in the current window with URLs loaded (handles suspended tabs)
    const tabs = await getAllTabsWithUrls();
    
    if (tabs.length <= 1) {
      return {
        success: true,
        closedCount: 0,
        keptCount: tabs.length,
        message: 'No duplicate tabs found'
      };
    }
    
    // Group tabs by normalized URL
    const tabGroups = new Map();
    
    tabs.forEach(tab => {
      // Skip invalid or special URLs
      if (!isValidUrl(tab.url)) {
        return;
      }
      
      const normalizedUrl = normalizeUrl(tab.url, ignoreQuery, ignoreHash);
      
      // Skip invalid normalized URLs (they won't match anything anyway)
      if (normalizedUrl.startsWith('__invalid__') || normalizedUrl.startsWith('__error__')) {
        return;
      }
      
      if (!tabGroups.has(normalizedUrl)) {
        tabGroups.set(normalizedUrl, []);
      }
      
      tabGroups.get(normalizedUrl).push(tab);
    });
    
    // Find tabs to close
    const tabsToClose = [];
    const tabsToKeep = [];
    
    tabGroups.forEach((groupTabs, normalizedUrl) => {
      if (groupTabs.length <= 1) {
        // No duplicates in this group
        tabsToKeep.push(...groupTabs);
        return;
      }
      
      // Sort to find the best tab to keep
      // We want the one with the highest anchor number
      groupTabs.sort((a, b) => compareTabs(a, b, ignoreHash));
      
      // Keep the first one (highest anchor number or most recent)
      const tabToKeep = groupTabs[0];
      tabsToKeep.push(tabToKeep);
      
      // Mark the rest for closing
      for (let i = 1; i < groupTabs.length; i++) {
        tabsToClose.push(groupTabs[i].id);
      }
    });
    
    // Close duplicate tabs
    let closedCount = 0;
    if (tabsToClose.length > 0) {
      await Promise.all(tabsToClose.map(tabId => chrome.tabs.remove(tabId)));
      closedCount = tabsToClose.length;
    }
    
    // Reload remaining tabs if requested
    if (reloadTabs && tabsToKeep.length > 0) {
      const reloadPromises = tabsToKeep.map(tab => 
        chrome.tabs.reload(tab.id).catch(err => {
          console.error(`Failed to reload tab ${tab.id}:`, err);
        })
      );
      await Promise.all(reloadPromises);
    }
    
    // Update badge after closing duplicates
    updateBadge();
    
    return {
      success: true,
      closedCount,
      keptCount: tabsToKeep.length,
      message: `Closed ${closedCount} duplicate tab(s)`
    };
  } catch (error) {
    console.error('Error closing duplicates:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Reload all tabs
async function reloadAllTabs() {
  try {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const reloadPromises = tabs.map(tab => 
      chrome.tabs.reload(tab.id).catch(err => {
        console.error(`Failed to reload tab ${tab.id}:`, err);
        return null;
      })
    );
    
    const results = await Promise.all(reloadPromises);
    const reloadedCount = results.filter(r => r !== null).length;
    
    return {
      success: true,
      reloadedCount,
      message: `Reloaded ${reloadedCount} tab(s)`
    };
  } catch (error) {
    console.error('Error reloading tabs:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'closeDuplicates') {
    closeDuplicates(request.ignoreQuery, request.ignoreHash, request.reloadTabs)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep the message channel open for async response
  }
  
  if (request.action === 'reloadAllTabs') {
    reloadAllTabs()
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep the message channel open for async response
  }
  
  if (request.action === 'updateBadge') {
    updateBadge().then(() => sendResponse({ success: true }));
    return true; // Keep the message channel open for async response
  }
  
  if (request.action === 'getDuplicateCount') {
    countDuplicates()
      .then(count => sendResponse({ success: true, count }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep the message channel open for async response
  }
});
