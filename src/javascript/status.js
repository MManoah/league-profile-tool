var setStatus = document.getElementById("setStatus");
var text = document.getElementById("text");
var message = {
  statusMessage: "",
};

setStatus.addEventListener("mousedown", function () {
  message["statusMessage"] = text.value;
  LeagueClient.requestStatus(message);
});
