var club = document.getElementById("clubs");
var setClub = document.getElementById("setClub");
var clubCode = document.getElementById("clubCode")
var clubKeys = {

};
var clubInfo = {
  lol: {
    clubsData: "",
  },
};
var optionsCopy = Object.assign({}, options);
optionsCopy["url"] = `${optionsCopy["url"]}/lol-chat/v1/me`;
optionsCopy["method"] = "PUT";
club.addEventListener("focus", function () {
  clubCode.classList.add("clubCodeFocus");
});
club.addEventListener("blur", function () {
  clubCode.classList.remove("clubCodeFocus");
});
club.addEventListener("change", function () {
  clubInfo["lol"]["clubsData"] = clubKeys[club.value];
  optionsCopy["body"] = JSON.stringify(clubInfo);
  run();
});
setClub.addEventListener("mousedown", function () {
  clubInfo["lol"]["clubsData"] = clubCode.value;
  optionsCopy["body"] = JSON.stringify(clubInfo);
  run();
});
function callback(error, response) {
  var dialogOptions = {};
  if (!error && response.statusCode === 201) {
    dialogOptions = {
      type: "info",
      title: "Success",
      message: "The club was set",
    };
  } else {
    dialogOptions = {
      type: "error",
      title: "Error",
      message: "There was an error setting the club",
    };
  }
  dialog.showMessageBox(dialogOptions);
}

function run() {
  request(optionsCopy, callback);
}
