var version = 0;
var champions = document.querySelector(".champions");
var iconCode = {
  key: "backgroundSkinId",
  value: 0,
};

// Get the latest patch
async function load() {
  let url = "https://ddragon.leagueoflegends.com/api/versions.json";
  let obj = await (await fetch(url)).json();
  version = obj[0];
}
load().then(function () {
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
            champions.innerHTML =
              '<h1 style="margin-top: -15px">Select a Skin</h1>';
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
                LeagueClient.makeRequest("POST", iconCode, "/lol-summoner/v1/current-summoner/summoner-profile")
              });
              champions.appendChild(node);
            }
          });
          async function load() {
            let url = `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion/${property}.json`;
            let obj = await (await fetch(url)).json();
            return obj["data"][property]["skins"];
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
});
