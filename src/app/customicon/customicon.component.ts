import {Component, OnInit} from '@angular/core';
import {LCUConnection} from "../core/connector/LCUConnection";
import {DialogComponent} from "../core/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-customicon',
  templateUrl: './customicon.component.html',
  styleUrls: ['./customicon.component.css']
})
export class CustomiconComponent implements OnInit {
  public searchKeyword: string;
  public allIcons: [Record<string, unknown>];

  constructor(public dialog: MatDialog) {
  }

  async ngOnInit(): Promise<void> {
    const link = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/summoner-icons.json';
    await (await fetch(link)).json().then(icons => {
      this.allIcons = icons;
    });
  }

  public setIcon(id: number): void {
    const body = {
      icon: id
    };
    LCUConnection.instance.requestSend(body, 'PUT', 'lolChat').then(response => {
      this.dialog.open(DialogComponent, {
        data: {body: response}
      });
    });
  }

}
