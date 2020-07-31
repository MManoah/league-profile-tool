var club = document.getElementById("clubs");
var setClub = document.getElementById("setClub");
var clubCode = document.getElementById("clubCode");
var clubKeys = {
 
};
var clubInfo = {
  lol: {
    clubsData: "",
  },
};
club.addEventListener("focus", function () {
  clubCode.classList.add("clubCodeFocus");
});
club.addEventListener("blur", function () {
  clubCode.classList.remove("clubCodeFocus");
});
club.addEventListener("change", function () {
  clubInfo["lol"]["clubsData"] = clubKeys[club.value];
  makeRequest("PUT", clubInfo, "/lol-chat/v1/me");
});
setClub.addEventListener("mousedown", function () {
  if (clubCode.value === "") {
    const dialogOptions = {
      type: "error",
      title: "Error",
      message: "Custom club data cannot be empty",
    };
    return dialog.showMessageBox(dialogOptions);
  }
  clubInfo["lol"]["clubsData"] = clubCode.value;
  makeRequest("PUT", clubInfo, "/lol-chat/v1/me");
});
