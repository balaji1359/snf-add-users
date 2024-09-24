document.addEventListener('DOMContentLoaded', () => {
    const extractButton = document.getElementById('extract');
    const contentDiv = document.getElementById('content');
    const storedItemsList = document.getElementById('storedItems');
    const clearAllButton = document.getElementById('clearAll');
    
    extractButton.addEventListener('click', () => {
      contentDiv.textContent = 'Extracting content...';
      
      chrome.runtime.sendMessage({action: "getXPathContent"}, (response) => {
        if (chrome.runtime.lastError) {
          contentDiv.textContent = 'Error: ' + chrome.runtime.lastError.message;
        } else if (response) {
          contentDiv.textContent = response.content || response.error || "Unknown response";
          if (response.content) {
            loadStoredItems();  // Refresh the list after new content is added
          }
        } else {
          contentDiv.textContent = "No response received";
        }
      });
    });
  
    clearAllButton.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete all stored items?')) {
        chrome.storage.local.clear(() => {
          loadStoredItems();
        });
      }
    });
  
    function loadStoredItems() {
      chrome.storage.local.get(null, (items) => {
        storedItemsList.innerHTML = '';
        for (let [key, value] of Object.entries(items)) {
          const li = document.createElement('li');
          li.textContent = `${key}: ${value}`;
          
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.className = 'delete-btn';
          deleteButton.addEventListener('click', () => deleteItem(key));
          
          li.appendChild(deleteButton);
          storedItemsList.appendChild(li);
        }
      });
    }
  
    function deleteItem(key) {
      chrome.storage.local.remove(key, () => {
        loadStoredItems();
      });
    }
  
    // Load stored items when popup is opened
    loadStoredItems();
  });