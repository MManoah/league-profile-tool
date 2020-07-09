var club = document.getElementById("clubs");
var setClub = document.getElementById("setClub");
var clubInfo = {
  lol: {
    clubsData: "",
  },
};
var optionsCopy = Object.assign({}, options);
optionsCopy["url"] = `${optionsCopy["url"]}/lol-chat/v1/me`;
optionsCopy["method"] = "PUT";

if (setClub.disabled === true) {
  club.addEventListener("change", function () {
    setClub.disabled = false;
    setClub.classList.add("setClubEnabled");
  });
}
setClub.addEventListener("mousedown", function () {
  clubInfo["lol"]["clubsData"] = process.env[club.value];
  optionsCopy["body"] = JSON.stringify(clubInfo);
  run();
});
function callback(error, response) {
  var dialogOptions = {};
  if (!error && response.statusCode === 201) {
    dialogOptions = {
      type: "info",
      title: "Success",
      message: "The club has been set",
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
