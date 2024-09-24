console.log('Content script loaded');

chrome.runtime.sendMessage({action: "contentScriptReady"});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getXPathContent") {
    const xpath = "/html/body/div[1]/div[3]/div/div/div/form/div[3]/div[2]/fieldset[2]/div[2]/table/tbody/tr";
    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (result) {
      sendResponse({content: result.innerText});
    } else {
      sendResponse({error: "Element not found"});
    }
  }
  return true;  // Keeps the message channel open for asynchronous response
});