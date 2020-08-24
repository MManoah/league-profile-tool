const { dialog } = require("electron").remote;
const { remote } = require("electron");
const sidePanel = document.querySelectorAll("h3");
let activePanel = sidePanel[0];
const LCUConnector = require("lcu-connector");
const connector = new LCUConnector();
const request = require("request");
const exit = document.querySelector("#exit");
var LeagueClient;

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

// Make a request to get the server and create a ClientConnection to make requests
connector.on("connect", (data) => {
  let url = `${data["protocol"]}://${data["address"]}:${data["port"]}`;
  let auth = "Basic " + btoa(`${data["username"]}:${data["password"]}`);
  let options = {
    rejectUnauthorized: false,
    headers: {
      Accept: "application/json",
      Authorization: auth,
    },
    url: `${url}/lol-chat/v1/me`,
    method: "GET",
  };
  request(options, function (error, response) {
    if (!error) {
      var summoner = JSON.parse(response.body);
      var summonerID = summoner.id;
      var server = summonerID.substring(
        summonerID.indexOf("@") + 1,
        summonerID.length
      );
      server = server.substring(0, server.indexOf("."));
      LeagueClient = new ClientConnection(url, options, server);
    } else {
      dialog.showErrorBox("Error", `Could not set summoner server\n${error}`);
      LeagueClient = new ClientConnection(url, options, "");
    }
  });
});

// Class to make requests to the client
class ClientConnection {
  constructor(url, options, server) {
    this.url = url;
    this.options = options;
    this.server = server;
  }
  makeRequest(method, body, endPoint) {
    this.options["url"] = this.url + endPoint;
    this.options["method"] = method;
    this.options["body"] = JSON.stringify(body);
    this.run(this.options);
  }
  run(command) {
    request(command, function (error, response) {
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
  getServer() {
    return this.server;
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

for (var i = 0; i < sidePanel.length - 1; i++) {
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
