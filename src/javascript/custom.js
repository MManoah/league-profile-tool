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
    dialogOptions = {
      type: "error",
      title: "Error",
      message: `Please enter in an endpoint`,
    };
    return dialog.showMessageBox(dialogOptions);
  } else if (method.value === "") {
    dialogOptions = {
      type: "error",
      title: "Error",
      message: `Please select a method`,
    };
    return dialog.showMessageBox(dialogOptions);
  }
  try {
    var body = JSON.parse(requestBody.value);
  } catch (e) {
    dialogOptions = {
      type: "error",
      title: "Error",
      message: `Invalid JSON for request body`,
    };
    return dialog.showMessageBox(dialogOptions);
  }
  sendRequest(method.value, body, endPoint.value);
});

reply.addEventListener("input", autoResize, false);

function autoResize() {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
}

function sendRequest(method, body, endPoint) {
  let optionsCopy = Object.assign({}, LeagueClient.options);
  optionsCopy["url"] = LeagueClient.url + endPoint;
  optionsCopy["method"] = method;
  optionsCopy["body"] = JSON.stringify(body);
  run(optionsCopy);
}

function run(command) {
  request(command, function (error, response) {
    let dialogOptions = {};
    try {
      dialogOptions = {
        type: "info",
        title: "Info",
        message: `Response status code: ${response.statusCode}`,
      };
      reply.value = "";
      var obj = JSON.parse(response.body);
      var format = JSON.stringify(obj, null, 3);
      reply.value = format;
      input = new Event("input");
      reply.dispatchEvent(input);
    } catch (e) {
      dialogOptions = {
        type: "info",
        title: "Info",
        message: "Made the request",
      };
    }
    dialog.showMessageBox(dialogOptions);
  });
}
