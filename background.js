chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getXPathContent") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: getXPathContent
        }, (results) => {
          if (chrome.runtime.lastError) {
            sendResponse({ error: chrome.runtime.lastError.message });
          } else if (results && results[0]) {
            sendResponse({ content: results[0].result });
          } else {
            sendResponse({ error: "Unknown error occurred" });
          }
        });
      });
      return true; // Indicates the response will be sent asynchronously
    } else if (request.action === "storeContent") {
      const key = new Date().toISOString();
      chrome.storage.local.set({ [key]: request.content }, () => {
        console.log('Content stored');
      });
      sendResponse({ success: true });
    } else if (request.action === "clearAll") {
      chrome.storage.local.clear(() => {
        sendResponse({ success: true });
      });
      return true;
    } else if (request.action === "deleteItem") {
      chrome.storage.local.remove(request.key, () => {
        sendResponse({ success: true });
      });
      return true;
    }
  });
  
  function getXPathContent() {
    const xpath = "/html/body/div[1]/div[3]/div/div/div/form/div[3]/div[2]/fieldset[2]/div[2]/table/tbody/tr";
    const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    let content = '';
    for (let i = 0; i < result.snapshotLength; i++) {
      const row = result.snapshotItem(i);
      const cells = row.querySelectorAll('td');
      let rowContent = '';
      cells.forEach(cell => {
        rowContent += cell.innerText + '\t';
      });
      content += rowContent.trim() + '\n';
    }
    return content;
  }
  