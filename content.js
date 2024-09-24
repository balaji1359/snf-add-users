chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getXPathContent") {
      const xpath = "/html/body/div[1]/div[3]/div/div/div/form/div[3]/div[2]/fieldset[2]/div[2]/table/tbody/tr";
      const results = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      
      if (results.snapshotLength > 0) {
        let content = '';
        
        // Iterate over all rows
        for (let i = 0; i < results.snapshotLength; i++) {
          const row = results.snapshotItem(i);
          const cells = row.querySelectorAll('td');
          
          let rowContent = '';
          cells.forEach(cell => {
            rowContent += cell.innerText.trim() + '\t';  // Add tab for formatting
          });
          content += rowContent.trim() + '\n';  // Newline for each row
        }
        
        sendResponse({content: content.trim()});  // Send content back to the background script
      } else {
        sendResponse({error: "Elements not found"});
      }
    }
    return true;  // Required for async sendResponse
  });
  