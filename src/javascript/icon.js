var imgButtons = document.querySelectorAll(".sumIcon");
var text = document.querySelector("#iconText");
var iconButton = document.querySelector("#iconCode");
var lolNames = document.querySelector("#lolNames");
var iconCode = {
  profileIconId: 0,
};
var anyIcon = {
  icon: 0,
};
for (let i = 0; i < imgButtons.length; i++) {
  imgButtons[i].addEventListener("mouseover", function () {
    this.classList.add("imgButtonToggle");
  });
  imgButtons[i].addEventListener("mouseleave", function () {
    this.classList.remove("imgButtonToggle");
  });
  imgButtons[i].addEventListener("mousedown", function () {
    iconCode["profileIconId"] = parseInt(this.alt);
    makeRequest("PUT", iconCode, "/lol-summoner/v1/current-summoner/icon");
  });
}
iconButton.addEventListener("mousedown", function () {
  let value = parseInt(text.value);
  if (!isNaN(value) && !(value < 0)) {
    anyIcon["icon"] = value;
    makeRequest("PUT", anyIcon, "/lol-chat/v1/me");
  } else {
    let dialogOptions = {
      type: "error",
      title: "Error",
      message: "Not a valid icon code",
    };
    dialog.showMessageBox(dialogOptions);
  }
});
lolNames.addEventListener("mousedown", function (e) {
  e.preventDefault();
  require("electron").shell.openExternal(
    "https://lolnames.gg/en/statistics/icons/"
  );
});
