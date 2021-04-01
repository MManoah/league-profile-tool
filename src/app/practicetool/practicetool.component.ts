import {Component} from '@angular/core';
import {LCUConnection} from "../core/connector/LCUConnection";
import {DialogComponent} from "../core/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-practicetool',
  templateUrl: './practicetool.component.html',
  styleUrls: ['./practicetool.component.css']
})
export class PracticetoolComponent {
  public lobbyName = "";

  constructor(public dialog: MatDialog) {
  }

  public makeLobby(): void {
    if (this.lobbyName === "") this.lobbyName = "Practice Tool";
    const body = {
      "customGameLobby": {
        "configuration": {
          "gameMode": "PRACTICETOOL",
          "gameMutator": "",
          "gameServerRegion": "",
          "mapId": 11,
          "mutators": {
            "id": 1
          },
          "spectatorPolicy": "NotAllowed",
          "teamSize": 5
        },
        "lobbyName": this.lobbyName,
        "lobbyPassword": ""
      },
      "isCustom": true
    };
    LCUConnection.instance.requestSend(body, 'POST', 'lobby').then(response => {
      this.dialog.open(DialogComponent, {
        data: {body: response}
      });
    });
  }
}
