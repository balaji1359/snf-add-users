document.getElementById('extract').addEventListener('click', () => {
    // Send message to background to extract XPath content
    chrome.runtime.sendMessage({ action: "getXPathContent" }, (response) => {
      if (response && response.content) {
        displayContent(response.content);
      } else {
        displayContent("No content found or error occurred: " + (response.error || "Unknown error"));
      }
    });
  });
  
  document.getElementById('clearAll').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "clearAll" }, () => {
      document.getElementById('storedItems').innerHTML = '';
    });
  });
  
  function displayContent(content) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `<pre><code>${content}</code></pre>`;
    // Highlight the code block (optional with highlight.js)
    hljs.highlightAll();
    
    // Store the content
    storeContent(content);
  }
  
  function storeContent(content) {
    const storedItems = document.getElementById('storedItems');
    const listItem = document.createElement('li');
    listItem.innerText = content.substring(0, 50) + '...'; // Show a snippet of the content
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: "deleteItem", key: listItem.dataset.key }, () => {
        listItem.remove();
      });
    });
    listItem.appendChild(deleteButton);
    storedItems.appendChild(listItem);
  
    // Send to background script to store content
    chrome.runtime.sendMessage({ action: "storeContent", content });
  }
  