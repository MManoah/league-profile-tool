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
      aram: "/lol-champ-select/v1/team-boost/purchase/",
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

  // Aram boost
  requestAram() {
    this.makeRequest("POST", "", this.#endpoints.aram);
  }

  // Change profile background
  requestBackground(body) {
    this.makeRequest("POST", body, this.#endpoints.profile);
  }

  // Set club with club data
  requestClubWData(body) {
    this.makeRequest("PUT", body, this.#endpoints.lolChat);
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
        let format = JSON.stringify(obj, null, 3);
        reply.value = format;
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

  // Gets club of a friend
  requestFriendClub(friendName, sendRequest, clubInfo, clubCode) {
    this.#options["url"] = this.#url + this.#endpoints.friends;
    this.#options["method"] = "GET";
    request(this.#options, function (error, response) {
      if (response.statusCode === 404) {
        return dialog.showErrorBox(
          "Error",
          "There was an error connecting to the friends list"
        );
      }
      let friendsList = JSON.parse(response.body);
      for (let i = 0; i < friendsList.length; i++) {
        // Friend has been found
        if (
          friendName.value.toUpperCase() === friendsList[i].name.toUpperCase()
        ) {
          let availability = friendsList[i].availability;
          let friendClubData = friendsList[i].lol.clubsData;
          // Friend has to be online to get club data
          if (availability === "offline" || availability === "mobile") {
            return dialog.showErrorBox("Error", "That friend is offline");
          } else if (friendClubData === undefined) {
            return dialog.showErrorBox(
              "Error",
              "That friends club data could not be found"
            );
          } else {
            if (sendRequest) {
              clubInfo["lol"]["clubsData"] = friendClubData;
              let endpoints = LeagueClient.endpoints;
              LeagueClient.makeRequest("PUT", clubInfo, endpoints.lolChat);
            } else {
              let dialogOptions = {
                type: "info",
                title: "Success",
                message: "The request has been made",
              };
              dialog.showMessageBox(dialogOptions);
            }
            return (clubCode.value = friendClubData);
          }
        }
      }
      dialog.showErrorBox("Error", "Could not find that friend");
    });
  }

  // Gets club of person in custom game lobby, champ select, or post game
  requestClub(lobbyType, summonerSearch, sendRequest, clubInfo) {
    this.#options["url"] = this.#url + this.#endpoints.conversations;
    this.#options["method"] = "GET";
    request(this.#options, function (error, response) {
      if (response.statusCode === 404) {
        return dialog.showErrorBox("Error", `There was an error\n${error}`);
      }
      let lobbyID = "";
      let conversations = JSON.parse(response.body);
      let inLobby = false;
      for (let i = 0; i < conversations.length; i++) {
        let lobby = conversations[i];
        if (lobby.type === lobbyType) {
          inLobby = true;
          lobbyID = lobby.id;
          let endpoint = LeagueClient.endpoints.conversations;
          endpoint = `${endpoint}${lobbyID}/participants`;
          let options = LeagueClient.options;
          let url = LeagueClient.url;
          options["url"] = url + endpoint;
          options["method"] = "GET";
          request(options, function (error, response) {
            let summoners = JSON.parse(response.body);
            for (let i = 0; i < summoners.length; i++) {
              let currentSummoner = summoners[i];
              if (currentSummoner.name.toUpperCase() === summonerSearch) {
                let summonerClubData = currentSummoner.lol.clubsData;
                clubCode.value = summonerClubData;
                if (sendRequest) {
                  clubInfo["lol"]["clubsData"] = summonerClubData;
                  let endpoint = LeagueClient.endpoints.lolChat;
                  return LeagueClient.makeRequest("PUT", clubInfo, endpoint);
                } else {
                  let dialogOptions = {
                    type: "info",
                    title: "Success",
                    message: "The request has been made",
                  };
                  return dialog.showMessageBox(dialogOptions);
                }
              }
            }
            dialog.showErrorBox("Error", "Could not find that summoner");
          });
        }
      }
      if (!inLobby) {
        dialog.showErrorBox("Error", `You are not in ${lobbyType}`);
      }
    });
  }
  makeRequest(method, body, endPoint) {
    this.#options["url"] = this.#url + endPoint;
    this.#options["method"] = method;
    this.#options["body"] = JSON.stringify(body);
    this.run(this.#options);
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
