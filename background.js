chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getXPathContent") {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          function: getXPathContent,
        }, (results) => {
          if (chrome.runtime.lastError) {
            sendResponse({error: chrome.runtime.lastError.message});
          } else if (results && results[0]) {
            const result = results[0].result;
            if (result.content) {
              storeContent(result.content);
            }
            sendResponse(result);
          } else {
            sendResponse({error: "Unknown error occurred"});
          }
        });
      });
      return true;  // Indicates that the response is sent asynchronously
    } else if (request.action === "getStoredContent") {
      chrome.storage.local.get(null, (items) => {
        sendResponse(items);
      });
      return true;
    } else if (request.action === "deleteItem") {
      chrome.storage.local.remove(request.key, () => {
        sendResponse({success: true});
      });
      return true;
    }
  });
  
  function getXPathContent() {
    const xpath = "/html/body/div[1]/div[3]/div/div/div/form/div[3]/div[2]/fieldset[2]/div[2]/table/tbody/tr/td[1]";
    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (result) {
      return {content: result.innerText};
    } else {
      return {error: "Element not found"};
    }
  }
  
  function storeContent(content) {
    const key = new Date().toISOString();
    chrome.storage.local.set({[key]: content}, () => {
      console.log('Content stored');
    });
  }