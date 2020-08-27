var endPoint = document.getElementById("endPoint");
var method = document.getElementById("method");
var requestBody = document.getElementById("requestBody");
var requestLCU = document.getElementById("requestLCU");
var reply = document.getElementById("response");
var endpointList = document.getElementById("lcuEndpoints");

endpointList.addEventListener("mousedown", function () {
  require("electron").shell.openExternal(
    "http://www.mingweisamuel.com/lcu-schema/tool/"
  );
});

requestLCU.addEventListener("mousedown", function () {
  if (endPoint.value === "") {
    return dialog.showErrorBox("Error", "Please enter in an endpoint");
  } else if (method.value === "") {
    return dialog.showErrorBox("Error", "Please select a method");
  }
  try {
    var body = JSON.parse(requestBody.value);
  } catch (e) {
    return dialog.showErrorBox("Error", "Invalid JSON for request body");
  }
  LeagueClient.requestCustom(method.value, body, endPoint.value, reply);
});

reply.addEventListener("input", autoResize, false);

function autoResize() {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
}