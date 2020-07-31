var boost = document.getElementById("boost");

boost.addEventListener("mousedown", function () {
  const dialogOptions = {
    type: "question",
    title: "Confirmation",
    message:
        "Are you sure you want to continue? \n(Make sure you don't have enough RP for a boost)\nThis exploit can also be detected!",
    buttons: ["Yes", "No"],
  };

  dialog.showMessageBox(dialogOptions).then((response) => {
    if (response.response === 0)
      makeRequest("POST", "", "/lol-champ-select/v1/team-boost/purchase");
  });
});
