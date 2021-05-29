import {Component, OnInit} from '@angular/core';
import {DialogComponent} from "../core/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {LCUConnectionService} from "../core/services/lcuconnection/lcuconnection.service";
import {ChampionService} from "../core/services/champion/champion.service";

@Component({
  selector: 'app-customicon',
  templateUrl: './customicon.component.html',
  styleUrls: ['./customicon.component.css']
})
export class CustomiconComponent implements OnInit {
  public searchKeyword: string;
  public allIcons: [Record<string, unknown>];

  constructor(public dialog: MatDialog, private lcuConnectionService: LCUConnectionService, private championData: ChampionService) {
  }

  async ngOnInit() {
    this.championData.getSummonerIcons().subscribe(icons => {
      // @ts-ignore
      this.allIcons = icons;
    })
  }

  public setIcon(id: number) {
    const body = {
      icon: id
    };
    this.lcuConnectionService.requestSend(body, 'PUT', 'lolChat').then(response => {
      this.dialog.open(DialogComponent, {
        data: {body: response}
      });
    });
  }

}
