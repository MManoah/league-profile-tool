var homeIcons = document.querySelectorAll(".icon");
var newVersion = document.querySelector("#newVersion");
mouseDown(0, "https://github.com/MManoah");
mouseDown(1, "https://www.youtube.com/channel/UCd5nD5lMlHe55UW4iAlJGJA");
async function load() {
  let url =
    "https://raw.githubusercontent.com/MManoah/league-profile-tool/master/version.json";
  let obj = await (await fetch(url)).json();
  newVersion.innerHTML = `Newest Version: ${obj["version"]}`;
}
load();
for (var i = 0; i < homeIcons.length; i++) {
  homeIcons[i].addEventListener("mouseover", function () {
    this.classList.add("gitIconToggle");
  });
  homeIcons[i].addEventListener("mouseleave", function () {
    this.classList.remove("gitIconToggle");
  });
}
function mouseDown(element, url) {
  homeIcons[element].addEventListener("mousedown", function (e) {
    e.preventDefault();
    require("electron").shell.openExternal(url);
  });
}
