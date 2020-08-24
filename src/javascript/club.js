var club = document.querySelectorAll(".clubs");
var setClub = document.getElementById("setClub");
var clubCode = document.getElementById("clubCode");
var friendName = document.getElementById("friendName");
var lobbyMember = document.getElementById("lobbyMember");
var champSelectMem = document.getElementById("champSelect");
var getClubData = document.getElementById("getClubData");
var customClubs = document.getElementById("customClubs");
var fs = require("fs");

// Attempt to set any user set clubs in config/clubs.json
try {
  const jsonString = fs.readFileSync("./config/clubs.json");
  const data = JSON.parse(jsonString);
  Object.keys(data).forEach(function (key) {
    var option = document.createElement("option");
    option.label = key;
    option.text = key;
    option.classList.add("club");
    option.value = data[key];
    customClubs.add(option);
  });
} catch (err) {
  const dialogOptions = {
    type: "error",
    title: "Error",
    message: `There was an error with custom user clubs (${err})\nPlease make sure config/clubs.json is in proper JSON format`,
    buttons: ["Open Json Validator", "Ok"],
  };
  dialog.showMessageBox(dialogOptions).then((response) => {
    if (response.response === 0)
      require("electron").shell.openExternal("https://jsonlint.com/");
  });
}

var clubKeys = {

};
var clubInfo = {
  lol: {
    clubsData: "",
  },
};
for (var i = 0; i < club.length; i++) {
  club[i].addEventListener("focus", function () {
    friendName.classList.add("clubCodeFocus");
  });
  club[i].addEventListener("blur", function () {
    friendName.classList.remove("clubCodeFocus");
  });
}
club[0].addEventListener("change", function () {
  clubInfo["lol"]["clubsData"] = clubKeys[this.value];
  LeagueClient.makeRequest("PUT", clubInfo, "/lol-chat/v1/me");
});
club[1].addEventListener("change", function () {
  clubInfo["lol"]["clubsData"] = this.value;
  LeagueClient.makeRequest("PUT", clubInfo, "/lol-chat/v1/me");
});

setClub.addEventListener("mousedown", function () {
  getClub(true);
});
getClubData.addEventListener("mousedown", function () {
  getClub(false);
});
function getClub(sendRequest) {
  if (
    clubCode.value === "" &&
    friendName.value === "" &&
    lobbyMember.value === "" &&
    champSelectMem.value === ""
  ) {
    const dialogOptions = {
      type: "error",
      title: "Error",
      message:
        "Custom club data, friends name, or lobby members cannot be empty",
    };
    return dialog.showMessageBox(dialogOptions);
  } else if (friendName.value !== "") {
    let optionsCopy = Object.assign({}, LeagueClient.options);
    optionsCopy["url"] = LeagueClient.url + "/lol-chat/v1/friends";
    optionsCopy["method"] = "GET";
    request(optionsCopy, function (error, response) {
      if (response.statusCode !== 404) {
        var friends = JSON.parse(response.body);
        for (var i = 0; i < friends.length; i++) {
          if (
            friendName.value.toUpperCase() === friends[i].name.toUpperCase()
          ) {
            if (
              friends[i].availability === "offline" ||
              friends[i].availability === "mobile"
            ) {
              dialogOptions = {
                type: "error",
                title: "Error",
                message: "That friend is offline",
              };
            } else if (friends[i].lol.clubsData === undefined) {
              dialogOptions = {
                type: "error",
                title: "Error",
                message: "That friends club data could not be found",
              };
            } else {
              if (sendRequest) {
                clubInfo["lol"]["clubsData"] = friends[i].lol.clubsData;
                LeagueClient.makeRequest("PUT", clubInfo, "/lol-chat/v1/me");
              }
              return (clubCode.value = friends[i].lol.clubsData);
            }
            return dialog.showMessageBox(dialogOptions);
          }
        }
        dialogOptions = {
          type: "error",
          title: "Error",
          message: "Could not find that friend",
        };
        dialog.showMessageBox(dialogOptions);
      } else {
        dialogOptions = {
          type: "error",
          title: "Error",
          message: "There was an error connecting to the friends list",
        };
        dialog.showMessageBox(dialogOptions);
      }
    });
  } else if (champSelectMem.value !== "") {
    let optionsCopy = Object.assign({}, LeagueClient.options);
    optionsCopy["url"] = LeagueClient.url + "/lol-champ-select/v1/session";
    optionsCopy["method"] = "GET";
    request(optionsCopy, function (error, response) {
      if (response.statusCode === 404) {
        dialogOptions = {
          type: "error",
          title: "Error",
          message: "You are not in champ select",
        };
        return dialog.showMessageBox(dialogOptions);
      }
      var champSelectLobby = JSON.parse(response.body);
      var lobbyID = champSelectLobby.chatDetails.chatRoomName;
      var server = LeagueClient.getServer();
      var champSelectID = `${lobbyID.substring(
        0,
        lobbyID.indexOf("@")
      )}@champ-select.${server}.pvp.net/participants`;
      // optionsCopy = Object.assign({}, options);
      optionsCopy[
        "url"
      ] = `${LeagueClient.url}/lol-chat/v1/conversations/${champSelectID}`;
      optionsCopy["method"] = "GET";
      request(optionsCopy, function (error, response) {
        if (response.statusCode === 404) {
          dialogOptions = {
            type: "error",
            title: "Error",
            message: "There was an error",
          };
          return dialog.showMessageBox(dialogOptions);
        }
        var summoners = JSON.parse(response.body);
        for (var i = 0; i < summoners.length; i++) {
          if (
            champSelectMem.value.toUpperCase() ===
            summoners[i].name.toUpperCase()
          ) {
            if (sendRequest) {
              clubInfo["lol"]["clubsData"] = summoners[i].lol.clubsData;
              LeagueClient.makeRequest("PUT", clubInfo, "/lol-chat/v1/me");
            }
            return (clubCode.value = summoners[i].lol.clubsData);
          }
        }
        dialogOptions = {
          type: "error",
          title: "Error",
          message: "Could not find that summoner",
        };
        return dialog.showMessageBox(dialogOptions);
      });
    });
  } else if (lobbyMember.value !== "") {
    let optionsCopy = Object.assign({}, LeagueClient.options);
    optionsCopy["url"] = LeagueClient.url + "/lol-lobby/v2/lobby";
    optionsCopy["method"] = "GET";
    request(optionsCopy, function (error, response) {
      if (response.statusCode !== 404) {
        var chat = JSON.parse(response.body);
        var ID = chat.chatRoomId;
        var server = LeagueClient.getServer();
        var chatID = `${ID.substring(
          0,
          ID.indexOf("@")
        )}@sec.${server}.pvp.net`;
        var lobby = `/lol-chat/v1/conversations/${chatID}/participants`;
        optionsCopy["url"] = LeagueClient.url + lobby;
        optionsCopy["method"] = "GET";
        request(optionsCopy, function (error, response) {
          var participants = JSON.parse(response.body);
          for (var i = 0; i < participants.length; i++) {
            if (
              lobbyMember.value.toUpperCase() ===
              participants[i].name.toUpperCase()
            ) {
              if (sendRequest) {
                clubInfo["lol"]["clubsData"] = participants[i].lol.clubsData;
                LeagueClient.makeRequest("PUT", clubInfo, "/lol-chat/v1/me");
              }
              return (clubCode.value = participants[i].lol.clubsData);
            }
          }
          dialogOptions = {
            type: "error",
            title: "Error",
            message: "Could not find that lobby member",
          };
          return dialog.showMessageBox(dialogOptions);
        });
      } else {
        dialogOptions = {
          type: "error",
          title: "Error",
          message: "You are not in a lobby",
        };
        dialog.showMessageBox(dialogOptions);
      }
    });
  } else {
    if (sendRequest) {
      clubInfo["lol"]["clubsData"] = clubCode.value;
      LeagueClient.makeRequest("PUT", clubInfo, "/lol-chat/v1/me");
    }
  }
}
