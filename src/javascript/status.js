var setStatus = document.getElementById("setStatus");
var text = document.getElementById("text");
var message = {
  statusMessage: "",
};

setStatus.addEventListener("mousedown", function () {
  message["statusMessage"] = text.value;
  LeagueClient.makeRequest("PUT", message, "/lol-chat/v1/me");
});
