// Options page script

document.addEventListener('DOMContentLoaded', async () => {
  const ignoreQueryCheckbox = document.getElementById('ignoreQuery');
  const ignoreHashCheckbox = document.getElementById('ignoreHash');
  const reloadTabsCheckbox = document.getElementById('reloadTabs');
  const testBtn = document.getElementById('testBtn');
  const reloadAllBtn = document.getElementById('reloadAllBtn');
  const actionStatus = document.getElementById('actionStatus');
  const openaiKeyInput = document.getElementById('openaiKey');
  const claudeKeyInput = document.getElementById('claudeKey');
  const aiProviderSelect = document.getElementById('aiProvider');

  // Load saved settings
  const settings = await chrome.storage.local.get(['ignoreQuery', 'ignoreHash', 'reloadTabs', 'openaiKey', 'claudeKey', 'aiProvider']);
  ignoreQueryCheckbox.checked = settings.ignoreQuery !== false; // default to true
  ignoreHashCheckbox.checked = settings.ignoreHash !== false; // default to true
  reloadTabsCheckbox.checked = settings.reloadTabs === true;
  
  // Load AI settings
  if (settings.openaiKey) {
    openaiKeyInput.value = settings.openaiKey;
  }
  if (settings.claudeKey) {
    claudeKeyInput.value = settings.claudeKey;
  }
  aiProviderSelect.value = settings.aiProvider || 'openai';

  // Save settings when changed
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
  
  // Save AI settings
  openaiKeyInput.addEventListener('input', () => {
    chrome.storage.local.set({ openaiKey: openaiKeyInput.value.trim() });
  });
  
  claudeKeyInput.addEventListener('input', () => {
    chrome.storage.local.set({ claudeKey: claudeKeyInput.value.trim() });
  });
  
  aiProviderSelect.addEventListener('change', () => {
    chrome.storage.local.set({ aiProvider: aiProviderSelect.value });
  });

  // Test duplicate detection
  testBtn.addEventListener('click', async () => {
    testBtn.disabled = true;
    actionStatus.textContent = 'Checking for duplicates...';
    actionStatus.className = 'status info';

    try {
      // Get duplicate count
      const result = await chrome.runtime.sendMessage({ action: 'getDuplicateCount' });
      
      if (result.success) {
        if (result.count > 0) {
          actionStatus.textContent = `Found ${result.count} duplicate tab(s) that would be closed.`;
          actionStatus.className = 'status info';
        } else {
          actionStatus.textContent = 'No duplicate tabs found.';
          actionStatus.className = 'status success';
        }
      } else {
        actionStatus.textContent = result.error || 'An error occurred';
        actionStatus.className = 'status error';
      }
    } catch (error) {
      actionStatus.textContent = 'Error: ' + error.message;
      actionStatus.className = 'status error';
    } finally {
      testBtn.disabled = false;
    }
  });

  // Reload all tabs
  reloadAllBtn.addEventListener('click', async () => {
    reloadAllBtn.disabled = true;
    actionStatus.textContent = 'Reloading tabs...';
    actionStatus.className = 'status info';

    try {
      const result = await chrome.runtime.sendMessage({
        action: 'reloadAllTabs'
      });

      if (result.success) {
        actionStatus.textContent = `Reloaded ${result.reloadedCount} tab(s).`;
        actionStatus.className = 'status success';
      } else {
        actionStatus.textContent = result.error || 'An error occurred';
        actionStatus.className = 'status error';
      }
    } catch (error) {
      actionStatus.textContent = 'Error: ' + error.message;
      actionStatus.className = 'status error';
    } finally {
      reloadAllBtn.disabled = false;
    }
  });
});

