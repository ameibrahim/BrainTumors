function truncateString(string, limit = 30) {
  return string.substring(0, limit) + "...";
}

function uniqueID(stregth = 2) {
  const date = Date.now() + getRandomArbitrary(0, 9999);
  const dateReversed = parseInt(String(date).split("").reverse().join(""));
  const base36 = (number) => number.toString(36);
  if (stregth == 1) return base36(date);
  if (stregth == -1) return base36(dateReversed);
  return base36(dateReversed) + base36(date);

  // return crypto.randomUUID().split("-").join("");
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function setUsernameDetails(user) {
  document.querySelectorAll("#userName").forEach((item) => {
    item.setAttribute("data-en", user.name);
    item.setAttribute("data-tr", user.name);
  });
  document
    .querySelectorAll("#userPhoto")
    .forEach((item) => (item.src = user.photo));
}

function AJAXCall(callObject) {
  let { phpFilePath, rejectMessage, params, type } = callObject;

  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", phpFilePath, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
      if (this.status == 200) {
        let result =
          type == "fetch" ? JSON.parse(this.responseText) : this.responseText;

        console.log("look: ", result);

        //TODO: Take a look one more time
        if (result.length < 1 && type != "fetch")
          reject(rejectMessage || "SQLError");
        else {
          resolve(result);
        }
      } else {
        reject("Error With PHP Script");
      }
    };

    xhr.send(params);
  });
}

function loadImage(image, outputElement) {
  const output = document.querySelector(outputElement);
  output.src = URL.createObjectURL(image);
  output.onload = function () {
    URL.revokeObjectURL(output.src); // free memory
  };
}

async function uploadFile(
  file,
  progressElement = null,
  scriptPath = "../include/upload.php"
) {
  if (!file) {
    return false;
  }

  return new Promise((resolve, reject) => {
    let myFormData = new FormData();
    myFormData.append("file", file);

    let http = new XMLHttpRequest();
    http.open("POST", scriptPath, true);

    if (progressElement) {
      http.upload.addEventListener("progress", (event) => {
        let percent = (event.loaded / event.total) * 100;
        progressElement.style.width = Math.round(percent) + "%";
      });
    }

    http.onload = function () {
      console.log("Response from server:", this.responseText); // Log the response
      if (this.status == 200) {
        console.log("name2: ", this.responseText);
        resolve({
          oldFileName: file.name,
          newFileName: this.responseText,
          fileSize: Math.ceil((file.size / 1_000_000) * 100) / 100 + "MB",
        });
      } else {
        reject("error");
      }
    };

    http.send(myFormData);
  });
}

async function getUserDetails() {
  try {
    let result = await AJAXCall({
      phpFilePath: "../include/getPersonalDetails.php",
      rejectMessage: "Getting Personal Details Failed",
      params: "",
      type: "fetch",
    });

    if (result) {
      return result[0];
    }
  } catch (error) {
    console.log(error);
    // TODO: Logout
  }
}

function openPopup(selector) {
  let popup = document.querySelector(selector);
  popup.style.display = "grid";
}

function closePopup(selector) {
  let popup = document.querySelector(selector);
  popup.style.display = "none";
}

async function getGlobalDetails() {
  let result = await getUserDetails();

  if (!result.id) logout();
  else return result;
}

function createElement(type, className = "") {
  let element = document.createElement("div");
  element.className = className;
  return element;
}

function findElement(selector) {
  return document.querySelector(selector);
}

function findElements(...args) {
  let result = {};

  args.forEach((item) => {
    result[camelCase(item)] = findElement(item);
  });

  return result;
}

function camelCase(word) {
  return word
    .replace(".", "")
    .replace("#", "")
    .replace(/-([a-z])/g, function (k) {
      return k[1].toUpperCase();
    });
}

async function logout() {
  let result = await AJAXCall({
    phpFilePath: "../include/logout.php",
    rejectMessage: "logout error",
    params: "",
    type: "",
  });

  window.location.href = "../auth.php";
}

function getCurrentTimeInJSONFormat() {
  let now = new Date();
  return now.toJSON();
}

function clearEventListenersFor(old_element) {
  var new_element = old_element.cloneNode(true);
  old_element.parentNode.replaceChild(new_element, old_element);
  return new_element;
}

function loadLoader(message) {
  let loader = document.createElement("div");
  loader.className = "loading-overlay user-select-none";
  let body = document.querySelector("body");

  let loaderInnerHTML = `   <div class="overlay-inner-container">

            <div class="sk-fold">
                <div class="sk-fold-cube"></div>
                <div class="sk-fold-cube"></div>
                <div class="sk-fold-cube"></div>
                <div class="sk-fold-cube"></div>
            </div>

            <div class="loading-message">
                ${message}
            </div>
        </div>
    `;

  loader.innerHTML = loaderInnerHTML;
  body.appendChild(loader);

  return loader;
}

function removeLoader(loader) {
  loader.style.opacity = "0";
  setTimeout(() => loader.remove(), 1000);
}

function createParamatersFrom(data) {
  let params = "";
  let entries = Object.entries(data);

  entries.forEach(([key, value], index) => {
    let parameter = `${key}=${value}`;
    index < entries.length - 1
      ? (params += parameter + "&&")
      : (params += parameter);
  });

  return params;
}

function handlePredictContainerView() {
  openPopup(".prediction-overlay");
  resetPredictionOverlay();
}

function getDomain() {
  let currentURL = new URL(window.location.href);
  if (currentURL.port.length > 0)
    return `${currentURL.hostname}:${currentURL.port}`;
  return currentURL.hostname;
}

function clearEventListenersFor(old_element) {
  var new_element = old_element.cloneNode(true);
  old_element.parentNode.replaceChild(new_element, old_element);
  return new_element;
}

function filterOptionsOff(result) {
  const optionsavailable = [
    "acne",
    "chickenpox",
    "monkeypox",
    "non-skin",
    "normal",
  ]; //TODO: Extract out
  return optionsavailable.filter((a) => a != result);
}
