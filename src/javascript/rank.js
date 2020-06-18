var setRank = document.querySelector("#setRank");
var tier = document.querySelector("#tier");
var division = document.querySelector("#division");
var queue = document.querySelector("#queue");
var rankInfo = {
  lol: {
    rankedLeagueQueue: "",
    rankedLeagueTier: "",
    rankedLeagueDivision: "",
  },
};
var optionsCopy = Object.assign({}, options);
optionsCopy["url"] = `${optionsCopy["url"]}/lol-chat/v1/me`; // End point to set chat rank
optionsCopy["method"] = "PUT";

tier.addEventListener("change", function () {
  if (
    this.value === "MASTER" ||
    this.value === "GRANDMASTER" ||
    this.value === "CHALLENGER"
  ) {
    division.disabled = true;
  } else {
    division.disabled = false;
  }
});

setRank.addEventListener("mousedown", function () {
  rankInfo["lol"]["rankedLeagueTier"] = tier.value;
  rankInfo["lol"]["rankedLeagueDivision"] = division.value;
  if (queue.value === "SOLO") {
    rankInfo["lol"]["rankedLeagueQueue"] = "RANKED_SOLO_5x5";
  } else {
    rankInfo["lol"]["rankedLeagueQueue"] = "RANKED_TFT";
  }
  optionsCopy["body"] = JSON.stringify(rankInfo);
  run();
});
setRank.addEventListener("mouseover", function () {
  this.classList.add("rankOver");
});
setRank.addEventListener("mouseleave", function () {
  this.classList.remove("rankOver");
});
function callback(error, response) {
  var dialogOptions = {};
  if (!error && response.statusCode === 201) {
    dialogOptions = {
      type: "info",
      title: "Success",
      message: "The rank has been set",
    };
  } else {
    dialogOptions = {
      type: "error",
      title: "Error",
      message: "There was an error setting the rank",
    };
  }
  dialog.showMessageBox(dialogOptions);
}

function run() {
  request(optionsCopy, callback);
}
