var setStatus = document.getElementById("setStatus");
var text = document.getElementById("text");
var message = {
    statusMessage: "",
};

var optionsCopy = Object.assign({}, options);
optionsCopy[
  "url"
] = `${optionsCopy["url"]}/lol-chat/v1/me`; 
optionsCopy["method"] = "PUT";

setStatus.addEventListener("mousedown", function(){
    message["statusMessage"] = text.value;
    optionsCopy["body"] = JSON.stringify(message);
    run();
})

function callback(error, response) {
  var dialogOptions = {};
  if (!error && response.statusCode === 201) {
    dialogOptions = {
      type: "info",
      title: "Success",
      message: `The status has been set`,
    };
  } else {
    dialogOptions = {
      type: "error",
      title: "Error",
      message: "There was an error setting the status",
    };
  }
  dialog.showMessageBox(dialogOptions);
}

function run() {
  request(optionsCopy, callback);
}
