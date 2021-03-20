const { dialog } = require("electron").remote;
const { remote } = require("electron");
const sidePanel = document.querySelectorAll("h3");
const LCUConnector = require("lcu-connector");
const connector = new LCUConnector();
const request = require("request");
const exit = document.querySelector("#exit");
let activePanel = sidePanel[0];
let LeagueClient;

/* 
Look if user has set the path to the client, if so use that path,
otherwise the connector will try to find the path from the OS process list
*/
try {
  const fs = require("fs");
  const file = fs.readFileSync("config\\clientPath.txt").toString();
  if (file.split("\\").join("/") !== "") {
    connector._dirPath = file.split("\\").join("/");
  }
} catch (err) {}

connector.on("connect", (data) => {
  let url = `${data["protocol"]}://${data["address"]}:${data["port"]}`;
  let auth = "Basic " + btoa(`${data["username"]}:${data["password"]}`);
  LeagueClient = new ClientConnection(url, auth);
});

// Class to make requests to the client
class ClientConnection {
  // Private variables
  #url;
  #options;
  #endpoints;
  //

  constructor(url, auth) {
    this.#url = url;
    this.#options = {
      rejectUnauthorized: false,
      headers: {
        Accept: "application/json",
        Authorization: auth,
      },
      url: this.url,
    };
    this.#endpoints = {
      presetIcon: "/lol-summoner/v1/current-summoner/icon/",
      lolChat: "/lol-chat/v1/me/",
      profile: "/lol-summoner/v1/current-summoner/summoner-profile/",
      friends: "/lol-chat/v1/friends/",
      conversations: "/lol-chat/v1/conversations/",
    };
  }

  // Getters
  get endpoints() {
    return this.#endpoints;
  }
  get options() {
    return this.#options;
  }
  get url() {
    return this.#url;
  }
  //

  // Changes icon to the preset chinese ones
  requestPresetIcon(body) {
    this.makeRequest("PUT", body, this.#endpoints.presetIcon);
  }

  // Changes icon to user defined icon code
  requestAnyIcon(body) {
    this.makeRequest("PUT", body, this.#endpoints.lolChat);
  }

  // Change profile background
  requestBackground(body) {
    this.makeRequest("POST", body, this.#endpoints.profile);
  }

  // Change rank displayed on hover-card
  requestRank(body) {
    this.makeRequest("PUT", body, this.#endpoints.lolChat);
  }

  // Changes status
  requestStatus(body) {
    this.makeRequest("PUT", body, this.#endpoints.lolChat);
  }

  // Custom request
  requestCustom(method, body, endPoint, reply) {
    this.#options["url"] = this.#url + endPoint;
    this.#options["method"] = method;
    this.#options["body"] = JSON.stringify(body);
    request(this.#options, function (error, response) {
      let dialogOptions = {};
      try {
        dialogOptions = {
          type: "info",
          title: "Info",
          message: `Response status code: ${response.statusCode}`,
        };
        reply.value = "";
        let obj = JSON.parse(response.body);
        reply.value = JSON.stringify(obj, null, 3);
        let input = new Event("input");
        reply.dispatchEvent(input);
      } catch (e) {
        dialogOptions = {
          type: "info",
          title: "Info",
          message: "Made the request",
        };
      }
      dialog.showMessageBox(dialogOptions);
    });
  }

  makeRequest(method, body, endPoint) {
    this.#options["url"] = this.#url + endPoint;
    this.#options["method"] = method;
    this.#options["body"] = JSON.stringify(body);
    request(this.#options, function (error, response) {
      let dialogOptions = {};
      if (
          !error &&
          (response.statusCode === 201 ||
              response.statusCode === 200 ||
              response.statusCode === 204)
      ) {
        dialogOptions = {
          type: "info",
          title: "Success",
          message: "The request has been made",
        };
      } else {
        let status = "No response from LCU";
        try {
          status = response.body;
        } catch (e) {}
        dialogOptions = {
          type: "error",
          title: "Error",
          message: `There was an error: \n(${status})`,
        };
      }
      dialog.showMessageBox(dialogOptions);
    });
  }
}

// Close window when league client connection is lost
connector.on("disconnect", (data) => {
  dialog.showErrorBox(
    "Error",
    "The connection to the league client has been closed"
  );
  remote.BrowserWindow.getFocusedWindow().close();
});
connector.start();

exit.addEventListener("mouseover", function () {
  if (activePanel !== this) {
    this.classList.add("barMouseOver");
  }
});
exit.addEventListener("mouseleave", function () {
  if (activePanel !== this) {
    this.classList.remove("barMouseOver");
  }
});
exit.addEventListener("mousedown", function () {
  remote.BrowserWindow.getFocusedWindow().close();
});

for (let i = 0; i < sidePanel.length - 1; i++) {
  sidePanel[i].addEventListener("mouseover", function () {
    if (activePanel !== this) {
      this.classList.add("barMouseOver");
    }
  });
  sidePanel[i].addEventListener("mouseleave", function () {
    if (activePanel !== this) {
      this.classList.remove("barMouseOver");
    }
  });
  sidePanel[i].addEventListener("mousedown", function (e) {
    if (typeof e === "object" && e.button === 0) {
      activePanel.classList.remove("barMouseOver");
      activePanel = this;
      active();
    }
  });
}
active();

// Function to load each html page
function active() {
  activePanel.classList.add("barMouseOver");
  const page = activePanel.id;
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `./html/${page}.html`, true);
  xhr.onreadystatechange = function () {
    if (this.readyState !== 4) return;
    if (this.status !== 200) return;
    document.querySelector(".pane").innerHTML = this.responseText;
    loadjs(page);
  };
  xhr.send();
}
function loadjs(page) {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = `javascript/${page}.js`;
  script.defer = true;
  document.body.appendChild(script);
}
