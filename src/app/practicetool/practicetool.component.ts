import {Component} from '@angular/core';
import {DialogComponent} from "../core/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {LCUConnectionService} from "../core/services/lcuconnection/lcuconnection.service";

@Component({
  selector: 'app-practicetool',
  templateUrl: './practicetool.component.html',
  styleUrls: ['./practicetool.component.css']
})
export class PracticetoolComponent {
  public lobbyName = "";

  constructor(public dialog: MatDialog, private lcuConnectionService: LCUConnectionService) {
  }

  public makeLobby() {
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
    this.lcuConnectionService.requestSend(body, 'POST', 'lobby').then(response => {
      this.dialog.open(DialogComponent, {
        data: {body: response}
      });
    });
  }
}
