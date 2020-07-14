var imgButtons = document.querySelectorAll(".sumIcon");
var iconCode = {
  profileIconId: 0,
};

var optionsCopy = Object.assign({}, options);
optionsCopy[
  "url"
] = `${optionsCopy["url"]}/lol-summoner/v1/current-summoner/icon`; // End point to set profile icon
optionsCopy["method"] = "PUT";
for (var i = 0; i < imgButtons.length; i++) {
  imgButtons[i].addEventListener("mouseover", function () {
    this.classList.add("imgButtonToggle");
  });
  imgButtons[i].addEventListener("mouseleave", function () {
    this.classList.remove("imgButtonToggle");
  });
  imgButtons[i].addEventListener("mousedown", function () {
    iconCode["profileIconId"] = parseInt(this.alt);
    optionsCopy["body"] = JSON.stringify(iconCode);
    run();
  });
}

function callback(error, response) {
  var dialogOptions = {};
  if (!error && response.statusCode === 201) {
    dialogOptions = {
      type: "info",
      title: "Success",
      message: `The icon has been set`,
    };
  } else {
    dialogOptions = {
      type: "error",
      title: "Error",
      message: "There was an error setting the icon",
    };
  }
  dialog.showMessageBox(dialogOptions);
}

function run() {
  request(optionsCopy, callback);
}
