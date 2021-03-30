import {Component, OnInit} from '@angular/core';
import {LCUConnection} from "../connector/LCUConnection";
import {DialogComponent} from "../dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.css']
})
export class BackgroundComponent implements OnInit {
  public showingSkins = false;
  public currentVersion: string;
  public championImages = [];
  public skinsImages = [];
  public searchText: string;

  constructor(public dialog: MatDialog) {
  }

  async ngOnInit(): Promise<void> {
    let url = "https://ddragon.leagueoflegends.com/api/versions.json";
    await (await fetch(url)).json().then(async versions => {
      this.currentVersion = versions[0];
      url = `http://ddragon.leagueoflegends.com/cdn/${this.currentVersion}/data/en_US/champion.json`;
      await (await fetch(url)).json().then(championData => {
        try {
          for (const champion in championData.data) {
            const src = `http://ddragon.leagueoflegends.com/cdn/${this.currentVersion}/img/champion/${champion}.png`;
            this.championImages.push({
              src: src,
              alt: champion
            });
          }
        } catch (err) {
          console.log(err);
        }
      });
    });
  }

  public async getSkins(alt: string): Promise<void> {
    this.skinsImages = [];
    this.showingSkins = true;
    try {
      const skinURL = `http://ddragon.leagueoflegends.com/cdn/${this.currentVersion}/data/en_US/champion/${alt}.json`;
      await (await fetch(skinURL)).json().then(champion => {
        const skins = champion["data"][alt]["skins"];
        for (let i = 0; i < skins.length; i++) {
          this.skinsImages.push({
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            src: `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${alt}_${skins[i]["num"]}.jpg`,
            alt: skins[i]["id"]
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  public setBackground(id: string): void {
    const body = {
      key: "backgroundSkinId",
      value: parseInt(id)
    };
    LCUConnection.instance.requestSend(body, 'POST', 'profile').then(response => {
      this.dialog.open(DialogComponent, {
        data: {body: response}
      });
    });
  }
}
