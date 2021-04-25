// This is a test
let shopURL = "";

function launchSearch(input) {
  window.open(
    `https://partners.shopify.com/39932/stores?search_value=${input}`
  );
}

function findLabels() {
  let labels = document.getElementsByTagName("LABEL");

  //function to build a button on the page
  function buildSearchButton(target, url) {
    let parentDiv = target.parentElement;

    if (parentDiv.childNodes.length <= 2) {
      // if no button, build one :)
      // 1. Create the button
      let partnerSearchButton = document.createElement("button");
      partnerSearchButton.classList.add("shortcut__button");
      partnerSearchButton.innerHTML = "&#x1F50E;";
      // 2. Append somewhere
      parentDiv.appendChild(partnerSearchButton);
      // 3. Add event handler
      partnerSearchButton.addEventListener("click", function () {
        launchSearch(url);
      });
    }
  }

  for (label of labels) {
    labelTitle = label.innerText.toLowerCase();

    if (labelTitle === "storefront url") {
      let inputField = label.nextElementSibling;

      //Validate whether shopURL is a "myshopify.com" URL
      if (inputField.value.toString().includes(".myshopify.com")) {
        // Show success
        inputField.classList.add("shortcut_field");
        shopURL = inputField.value.toString();
        console.log(`Storefront URL found: ${shopURL}`);
        buildSearchButton(inputField, shopURL);
      }
    }
  }
}

function loadCheck() {
  let checkPresence = setInterval(function () {
    findLabels();
    if (shopURL != "") {
      clearInterval(checkPresence);
    }
  }, 1000);
}

loadCheck();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message.includes("Tab:")) {
    console.log(`${request.message}`);
    loadCheck();
  }
});

// + Add This Stuff
// If nothing is present, add an event listener for when that changes, then run the check again
