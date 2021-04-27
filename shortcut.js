/* 
- Initialize Variables
- Sanitize arrays (let groups = []) arrays of objects -> two arrays - 1 of labels + 1 of constructed button objects
- Run program 
- Initialize timer
*/
function removeShortcuts() {
  let shortcuts = document.querySelectorAll("#shortcut");
  console.log(shortcuts.length);

  while (shortcuts[0]) {
    shortcuts[0].parentNode.removeChild(shortcuts[0]);
  }
}

let labels = [];
let buttonsArray = [];

function launchSearch(input) {
  /* NOTE Still need to build out cases for PxU vs. OOTS Partner links */
  window.open(
    `https://partners.shopify.com/39932/stores?search_value=${input}`
  );
}

/* 
- Create button objects + constructors  
  - type: enabled = button success style + working link + click listener
  - type: invalid = button failed style + update listener 
*/

class ShortcutButton {
  constructor(value, parent, type) {
    this.value = value;
    this.parent = parent;
    this.type = type;
  }
}

/* 
- Search for elements
- add all to array
- Validate variable inputs for type 1 or 2
- construct buttons objects and add to objects array
*/

function findLabels() {
  //Find all labels
  let labels = document.getElementsByTagName("LABEL");

  for (label of labels) {
    //Pick out Storefront URL labels
    labelTitle = label.innerText.toLowerCase();
    if (labelTitle === "storefront url") {
      //select it's input field
      let inputField = label.nextElementSibling;
      //Validate whether shopURL is a "myshopify.com" URL
      if (inputField.value.toString().includes(".myshopify.com")) {
        // success type
        let shopURL = inputField.value.toString();
        console.log(
          `%cShortcuts– Valid Storefront URL found: ${shopURL}`,
          "color:green;"
        );
        buttonsArray.push(
          new ShortcutButton(shopURL, inputField.parentElement, "success")
        );
      } else if (inputField.value.toString() == "") {
        // failure type 1 (no input)
        let shopURL = inputField.value.toString();
        console.log(
          `%cShortcuts– No Storefront URL found. Please use 'storename.myshopify.com' in Storefront URL ticket field.`,
          "color:red;"
        );
        buttonsArray.push(
          new ShortcutButton(shopURL, inputField.parentElement, "failed-1")
        );
      } else {
        // failure type 2 (wrong input)
        let shopURL = inputField.value.toString();
        console.log(
          `%cShortcuts– Invalid Storefront URL found: ${shopURL}. Please use 'storename.myshopify.com' in Storefront URL ticket field.`,
          "color:red;"
        );
        buttonsArray.push(
          new ShortcutButton(shopURL, inputField.parentElement, "failed-2")
        );
      }
    }
  }
}

/* 
- For each object
--Create buttons
- Add event listeners to buttons 
  - type: enabled = button success style + working link + click listener
  - type: invalid = button failed style + update listener 
-- Append buttons to parent elements
*/

function buildButtons() {
  for (button of buttonsArray) {
    let value = button.value;
    let parent = button.parent;
    let type = button.type;

    function build(btnURL, btnParent, btnType) {
      let partnerButton = document.createElement("button");
      partnerButton.classList.add(`shortcut__button--${btnType}`);
      partnerButton.setAttribute("id:", "shortcut");

      switch (btnType) {
        case "success": {
          console.log("log success case");
          // 1. Create the button
          partnerButton.innerHTML = "&#x1F50E;";
          partnerButton.title = "Click to search partner dashboard.";
          // 2. Append to parent
          parent.appendChild(partnerButton);
          // 3. Add event handler
          partnerButton.addEventListener("click", function () {
            launchSearch(value);
          });
          break;
        }
        case "failed-1":
        case "failed-2": {
          let inputBox = parent.getElementsByTagName("INPUT")[0];
          // 1. Create the button
          partnerButton.innerHTML = "&#9432;";
          partnerButton.title =
            "Invalid link. Please use storename.myshopify.com instead.";
          // 3. Add event handler and append button if URL found (aka failed-1 = no input and failed-2 = invalid input found)
          if (btnType == "failed-1") {
            inputBox.onchange = () => {
              if (inputBox.value != "") {
                loadCheck();
              }
            };
          } else {
            parent.appendChild(partnerButton);
            partnerButton.addEventListener("click", function () {
              launchSearch(value);
            });
          }
        }
      }
      // partnerButton.addEventListener("change", function () {
      //   launchSearch(value);
      // }
    }

    //Check whether there's already a button here and only add one if not.
    if (parent.childNodes.length <= 2) {
      build(value, parent, type);
    }
  }
}

/* set timer to check for labels that exist on the page, and then run the program */
function loadCheck() {
  // initialize arrays and buttons
  labels = [];
  buttonsArray = [];
  removeShortcuts();

  //check for new labels
  let checkForLabels = setInterval(function () {
    findLabels();
    buildButtons();
    if (buttonsArray.length > 0) {
      clearInterval(checkForLabels);
    }
  }, 1000);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message.includes("Tab:")) {
    console.log(`%cShortcuts– background: ${request.message}`, "color:white;");
    loadCheck();
  }
});

loadCheck();

function logChange() {
  console.log("change logged");
}
