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
    LeagueClient.requestPresetIcon(iconCode);
  });
}
iconButton.addEventListener("mousedown", function () {
  let value = parseInt(text.value);
  if (!isNaN(value) && !(value < 0)) {
    anyIcon["icon"] = value;
    LeagueClient.requestAnyIcon(anyIcon);
  } else {
    dialog.showErrorBox("Error", "Not a valid icon code");
  }
});
lolNames.addEventListener("mousedown", function (e) {
  e.preventDefault();
  require("electron").shell.openExternal(
    "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/"
  );
});
