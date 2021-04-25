chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && changeInfo.url.includes("zendesk.com/agent/tickets/")) {
    let newURL = changeInfo.url;
    chrome.tabs.sendMessage(tabId, {
      message: `Tab: ${tabId} - Opened this ticket: ${newURL}`,
      url: "newURL",
    });
    console.log(`Tab: ${tabId} - Opened this ticket: ${newURL}`);
  }
});
