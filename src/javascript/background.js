var version = 0;
var champions = document.querySelector(".champions");
var iconCode = {
  key: "backgroundSkinId",
  value: 0,
};
async function load() {
  let url = "https://ddragon.leagueoflegends.com/api/versions.json";
  let obj = await (await fetch(url)).json();
  version = obj[0];
}
load().then(function () {
  var optionsCopy = Object.assign({}, options);
  optionsCopy[
    "url"
  ] = `${optionsCopy["url"]}/lol-summoner/v1/current-summoner/summoner-profile`; // Endpoint to set summoner profile background
  optionsCopy["method"] = "POST";

  async function load() {
    let url = `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`;
    let obj = await (await fetch(url)).json();
    return obj["data"];
  }

  load().then(function (keys) {
    try {
      for (const property in keys) {
        var node = document.createElement("IMG");
        node.classList.add("championIcon");
        node.src = `http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${property}.png`;
        node.alt = property;
        node.addEventListener("mouseover", function () {
          this.classList.add("imgButtonToggle");
        });
        node.addEventListener("mouseleave", function () {
          this.classList.remove("imgButtonToggle");
        });
        node.addEventListener("mousedown", function () {
          load().then(function (skins) {
            champions.innerHTML = "<h1 style=\"margin-top: 5px\">Select a Skin</h1>";
            for (var i = 0; i < skins.length; i++) {
              var node = document.createElement("IMG");
              node.src = `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${property}_${skins[i]["num"]}.jpg`;
              node.alt = skins[i]["id"];
              node.classList.add("skinSplash");
              node.addEventListener("mouseover", function () {
                this.classList.add("imgButtonToggle");
              });
              node.addEventListener("mouseleave", function () {
                this.classList.remove("imgButtonToggle");
              });
              node.addEventListener("mousedown", function () {
                iconCode["value"] = parseInt(this.alt);
                optionsCopy["body"] = JSON.stringify(iconCode);
                run();
              });
              champions.appendChild(node);
            }
          });
          async function load() {
            let url = `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion/${property}.json`;
            let obj = await (await fetch(url)).json();
            var skin = obj["data"][property]["skins"];
            return skin;
          }
        });
        champions.appendChild(node);
      }
    } catch (e) {
      dialog.showErrorBox(
        "Error",
        "Something has went wrong, try restarting the application"
      );
    }
  });

  function callback(error, response, body) {
    var dialogOptions = {};
    if (!error && response.statusCode == 200) {
      dialogOptions = {
        type: "info",
        title: "Success",
        message: "The background has been set",
      };
    } else {
      dialogOptions = {
        type: "error",
        title: "Error",
        message: "There was an error setting the background",
      };
    }
    dialog.showMessageBox(dialogOptions);
  }
  function run() {
    request(optionsCopy, callback);
  }
});
