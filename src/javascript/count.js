var displayChampArea = document.querySelector(".ownedChamps");
var optionsCopy = Object.assign({}, LeagueClient.options);
optionsCopy["url"] = LeagueClient.url + "/lol-summoner/v1/current-summoner";
optionsCopy["method"] = "GET";
var summonerID = 0;
var version = 0;
async function load() {
  let url = "https://ddragon.leagueoflegends.com/api/versions.json";
  let obj = await (await fetch(url)).json();
  version = obj[0];
}
load().then(function () {
  getSummonerID();
  function callback(error, response, body) {
    if (!error && response.statusCode === 200) {
      summonerID = JSON.parse(body);
      summonerID = summonerID["summonerId"];
      // let optionsCopy2 = Object.assign({}, options);
      optionsCopy[
        "url"
      ] = `${LeagueClient.url}/lol-champions/v1/inventories/${summonerID}/champions`;
      optionsCopy["method"] = "GET";
      getOwnedChampions(optionsCopy);
    } else {
      dialog.showErrorBox(
        "Error",
        "Something went wrong, try restarting the application"
      );
    }
  }
  function getSummonerID() {
    request(optionsCopy, callback);
  }

  function getOwnedChampions(value) {
    try {
      request(value, function (error, response, body) {
        if (!error) {
          let championsList = JSON.parse(body);
          let championArr = {};
          let skinArr = {};
          for (let i = 0; i < championsList.length; i++) {
            if (championsList[i]["ownership"]["owned"]) {
              let alias = championsList[i]["alias"];
              let name = championsList[i]["name"];
              let date =
                championsList[i]["ownership"]["rental"]["purchaseDate"];
              date = new Date(date).toLocaleString("en-US");
              championArr[name] = {
                alias: {},
                name: {},
                date: {},
              };
              championArr[name]["alias"] = alias;
              championArr[name]["name"] = name;
              championArr[name]["date"] = date;
              for (let x = 1; x < championsList[i]["skins"].length; x++) {
                if (championsList[i]["skins"][x]["ownership"]["owned"]) {
                  let skinName = championsList[i]["skins"][x]["name"];
                  let skinDate =
                    championsList[i]["skins"][x]["ownership"]["rental"][
                      "purchaseDate"
                    ];
                  skinDate = new Date(skinDate).toLocaleString("en-US");
                  try {
                    skinArr[championsList[i]["alias"]]["skins"][
                      skinName
                    ] = skinDate;
                  } catch (e) {
                    skinArr[championsList[i]["alias"]] = {
                      skins: {},
                    };
                    skinArr[championsList[i]["alias"]]["skins"][
                      skinName
                    ] = skinDate;
                  }
                }
              }
            }
          }
          for (let [key, value] of Object.entries(championArr)) {
            fetch(
              `http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championArr[key]["alias"]}.png`,
              { method: "HEAD" }
            ).then((res) => {
              if (res.ok) {
                addItem(
                  `http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championArr[key]["alias"]}.png`,
                  championArr[key]["alias"],
                  championArr[key]["date"]
                );
              } else {
                addItem(
                  `http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championArr[key]["name"]}.png`,
                  championArr[key]["alias"],
                  championArr[key]["date"]
                );
              }
            });
          }
          function addItem(image, champion, date) {
            let node = document.createElement("IMG");
            node.src = image;
            node.classList.add("championIcon");
            node.alt = champion;
            node.addEventListener("mouseover", function () {
              this.classList.add("imgButtonToggle");
            });
            node.addEventListener("mouseleave", function () {
              this.classList.remove("imgButtonToggle");
            });
            node.addEventListener("mousedown", function () {
              let content = document.querySelector(".content");
              content.innerHTML = `<h1 style=\"margin-top: -15px\">Champion Purchase Date: ${date}</h1>`;
              if (this.alt in skinArr) {
                let node1 = document.createElement("H2");
                node1.innerText = JSON.stringify(
                  skinArr[this.alt]["skins"],
                  null,
                  4
                );
                content.appendChild(node1);
              }
            });
            displayChampArea.appendChild(node);
          }
        } else {
          dialog.showErrorBox(
            "Error",
            "Something went wrong, try restarting the application"
          );
        }
      });
    } catch (e) {
      dialog.showErrorBox(
        "Error",
        "Something went wrong, try restarting the application"
      );
    }
  }
});
