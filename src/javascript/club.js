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
  LeagueClient.requestClubWData(clubInfo);
});
club[1].addEventListener("change", function () {
  clubInfo["lol"]["clubsData"] = this.value;
  LeagueClient.requestClubWData(clubInfo);
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
    return dialog.showErrorBox(
      "Error",
      "Custom club data, friends name, or lobby members cannot be empty"
    );
  } else if (friendName.value !== "") {
    LeagueClient.requestFriendClub(friendName, sendRequest, clubInfo, clubCode);
  } else if (champSelectMem.value !== "") {
    LeagueClient.requestClub(
      "championSelect",
      champSelectMem.value.toUpperCase(),
      sendRequest,
      clubInfo
    );
  } else if (lobbyMember.value !== "") {
    LeagueClient.requestClub(
      "customGame",
      lobbyMember.value.toUpperCase(),
      sendRequest,
      clubInfo
    );
  } else {
    if (sendRequest) {
      clubInfo["lol"]["clubsData"] = clubCode.value;
      return LeagueClient.requestClubWData(clubInfo);
    }
    dialog.showErrorBox(
      "Error",
      "Please enter a summoners name to get club data"
    );
  }
}
