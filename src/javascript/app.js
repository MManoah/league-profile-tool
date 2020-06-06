const { dialog } = require("electron").remote;
const { remote } = require("electron");
var sidePanel = document.querySelectorAll("h3");
var activePanel = sidePanel[0];
const LCUConnector = require("lcu-connector");
const connector = new LCUConnector();
const request = require("request");
var exit = document.querySelector("#exit");
var options = {
  rejectUnauthorized: false,
  headers: {
    Accept: "application/json",
  },
};
window.addEventListener("keydown", function (event) {

  if (event.key === 17 && event.key === 82) {
    this.alert("yes")
  } 
}, true);

connector.on("connect", (data) => {
  options["url"] = `${data["protocol"]}://${data["address"]}:${data["port"]}`;
  options["headers"]["Authorization"] =
    "Basic " + btoa(`${data["username"]}:${data["password"]}`);
});
connector.on("disconnect", (data) => {
  dialog.showErrorBox(
    "Error",
    "The connection to the league client has been closed"
  );
  remote.BrowserWindow.getFocusedWindow().close();
});
connector.start();

exit.addEventListener("mouseover", function () {
  if (activePanel !== this) {
    this.classList.add("barMouseOver");
  }
});
exit.addEventListener("mouseleave", function () {
  if (activePanel !== this) {
    this.classList.remove("barMouseOver");
  }
});
exit.addEventListener("mousedown", function () {
  remote.BrowserWindow.getFocusedWindow().close();
});

for (var i = 0; i < sidePanel.length - 1; i++) {
  sidePanel[i].addEventListener("mouseover", function () {
    if (activePanel !== this) {
      this.classList.add("barMouseOver");
    }
  });
  sidePanel[i].addEventListener("mouseleave", function () {
    if (activePanel !== this) {
      this.classList.remove("barMouseOver");
    }
  });
  sidePanel[i].addEventListener("mousedown", function (e) {
    if (typeof e === "object" && e.button === 0) {
      activePanel.classList.remove("barMouseOver");
      activePanel = this;
      active();
    }
  });
}
active();
function active() {
  activePanel.classList.add("barMouseOver");
  var page = activePanel.id;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", `./html/${page}.html`, true);
  xhr.onreadystatechange = function () {
    if (this.readyState !== 4) return;
    if (this.status !== 200) return;
    document.querySelector(".pane").innerHTML = this.responseText;
  };
  xhr.send();
  loadjs(page);
}
function loadjs(page) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = `javascript/${page}.js`;
  script.defer = true;
  document.body.appendChild(script);
}
