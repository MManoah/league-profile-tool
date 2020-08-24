var queue = document.querySelectorAll(".queue");
var rankMain = document.querySelector(".rankMain");
var ranks = ["IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"];
var divisions = ["IV", "III", "II", "I"];
var divValue = 0;
var value = 0;
var rankInfo = {
  lol: {
    rankedLeagueQueue: "",
    rankedLeagueTier: "",
    rankedLeagueDivision: "",
  },
};

for (let i = 0; i < queue.length; i++) {
  queue[i].addEventListener("mouseover", function () {
    this.classList.add("queueButtonToggle");
  });
  queue[i].addEventListener("mouseleave", function () {
    this.classList.remove("queueButtonToggle");
  });
  queue[i].addEventListener("mousedown", function () {
    rankInfo["lol"]["rankedLeagueQueue"] = this.id;
    rankMain.innerHTML = '<h1 style="margin-top: -15px">Select A Rank</h1>';
    for (let i = 1; i < 28; i++) {
      let node = document.createElement("IMG");
      node.src = `../src/images/Ranked Emblems/${i}.png`;
      node.width = "150";
      node.classList.add("rankedEmblem");
      node.addEventListener("mouseover", function () {
        this.classList.add("queueButtonToggle");
      });
      node.addEventListener("mouseleave", function () {
        this.classList.remove("queueButtonToggle");
      });
      if (i % 4 !== 0 && i !== 25 && i !== 26 && i !== 27) {
        node.alt = `${ranks[value]}`;
        node.id = divisions[divValue];
        divValue++;
      } else if (i % 4 === 0 && i !== 25 && i !== 26 && i !== 27) {
        node.alt = `${ranks[value]}`;
        node.id = divisions[divValue];
        divValue = 0;
        value++;
      } else {
        this.id = "";
        switch (i) {
          case 25:
            node.alt = "MASTER";
            break;
          case 26:
            node.alt = "GRANDMASTER";
            break;
          case 27:
            node.alt = "CHALLENGER";
            break;
          default:
            break;
        }
      }
      node.addEventListener("mousedown", function () {
        rankInfo["lol"]["rankedLeagueTier"] = this.alt;
        rankInfo["lol"]["rankedLeagueDivision"] = this.id;
        LeagueClient.makeRequest("PUT", rankInfo, "/lol-chat/v1/me");
      });
      rankMain.appendChild(node);
    }
  });
}
