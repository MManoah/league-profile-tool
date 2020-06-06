var homeIcons = document.querySelectorAll(".icon");

mouseDown(0, "https://github.com/MManoah");
mouseDown(1, "https://www.youtube.com/channel/UCd5nD5lMlHe55UW4iAlJGJA");

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
