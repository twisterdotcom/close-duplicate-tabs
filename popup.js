// Popup script for Close Duplicate Tabs extension

document.addEventListener('DOMContentLoaded', async () => {
  const closeDuplicatesBtn = document.getElementById('closeDuplicatesBtn');
  const reloadAllBtn = document.getElementById('reloadAllBtn');
  const status = document.getElementById('status');
  const ignoreQueryCheckbox = document.getElementById('ignoreQuery');
  const ignoreHashCheckbox = document.getElementById('ignoreHash');
  const reloadTabsCheckbox = document.getElementById('reloadTabs');

  // Load saved settings
  const settings = await chrome.storage.local.get(['ignoreQuery', 'ignoreHash', 'reloadTabs']);
  ignoreQueryCheckbox.checked = settings.ignoreQuery !== false; // default to true
  ignoreHashCheckbox.checked = settings.ignoreHash !== false; // default to true
  reloadTabsCheckbox.checked = settings.reloadTabs === true;

  // Save settings when changed and update badge
  ignoreQueryCheckbox.addEventListener('change', () => {
    chrome.storage.local.set({ ignoreQuery: ignoreQueryCheckbox.checked });
    chrome.runtime.sendMessage({ action: 'updateBadge' });
  });
  ignoreHashCheckbox.addEventListener('change', () => {
    chrome.storage.local.set({ ignoreHash: ignoreHashCheckbox.checked });
    chrome.runtime.sendMessage({ action: 'updateBadge' });
  });
  reloadTabsCheckbox.addEventListener('change', () => {
    chrome.storage.local.set({ reloadTabs: reloadTabsCheckbox.checked });
  });
  
  // Update badge when popup opens (in case tabs changed)
  chrome.runtime.sendMessage({ action: 'updateBadge' });

  // Close duplicates button
  closeDuplicatesBtn.addEventListener('click', async () => {
    closeDuplicatesBtn.disabled = true;
    status.textContent = 'Processing...';
    status.className = 'status info';

    try {
      const ignoreQuery = ignoreQueryCheckbox.checked;
      const ignoreHash = ignoreHashCheckbox.checked;
      const reloadTabs = reloadTabsCheckbox.checked;

      // Send message to background script to close duplicates
      const result = await chrome.runtime.sendMessage({
        action: 'closeDuplicates',
        ignoreQuery,
        ignoreHash,
        reloadTabs
      });

      if (result.success) {
        status.textContent = `Closed ${result.closedCount} duplicate tab(s). Kept ${result.keptCount} tab(s).`;
        status.className = 'status success';
      } else {
        status.textContent = result.error || 'An error occurred';
        status.className = 'status error';
      }
    } catch (error) {
      status.textContent = 'Error: ' + error.message;
      status.className = 'status error';
    } finally {
      closeDuplicatesBtn.disabled = false;
    }
  });

  // Reload all tabs button
  reloadAllBtn.addEventListener('click', async () => {
    reloadAllBtn.disabled = true;
    status.textContent = 'Reloading tabs...';
    status.className = 'status info';

    try {
      const result = await chrome.runtime.sendMessage({
        action: 'reloadAllTabs'
      });

      if (result.success) {
        status.textContent = `Reloaded ${result.reloadedCount} tab(s).`;
        status.className = 'status success';
      } else {
        status.textContent = result.error || 'An error occurred';
        status.className = 'status error';
      }
    } catch (error) {
      status.textContent = 'Error: ' + error.message;
      status.className = 'status error';
    } finally {
      reloadAllBtn.disabled = false;
    }
  });
});
