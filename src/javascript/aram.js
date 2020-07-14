var boost = document.getElementById("boost");
var optionsCopy = Object.assign({}, options);
optionsCopy[
  "url"
] = `${optionsCopy["url"]}/lol-champ-select/v1/team-boost/purchase`;
optionsCopy["method"] = "POST";

boost.addEventListener("mousedown", function () {
  var dialogOptions = {
    type: "question",
    title: "Confirmation",
    message:
      "Are you sure you want to continue? \n(Make sure you don't have enough RP for a boost)",
    buttons: ["Yes", "No"],
  };

  dialog.showMessageBox(dialogOptions).then((response) => {
    if (response.response === 0) run();
  });
});

function callback(error, response) {
  var dialogOptions = {};
  if (!error && response.statusCode === 204) {
    dialogOptions = {
      type: "info",
      title: "Success",
      message: `Success`,
    };
  } else {
    dialogOptions = {
      type: "error",
      title: "Error",
      message: "There was an error",
    };
  }
  dialog.showMessageBox(dialogOptions);
}

function run() {
  request(optionsCopy, callback);
}
