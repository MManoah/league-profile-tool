import {Component, OnInit} from '@angular/core';
import {DialogComponent} from "../core/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {LCUConnectionService} from "../core/services/lcuconnection/lcuconnection.service";
import {VersionService} from "../core/services/version/version.service";
import {ChampionService} from "../core/services/champion/champion.service";

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

  constructor(public dialog: MatDialog, private lcuConnectionService: LCUConnectionService, private version: VersionService, private championData: ChampionService) {
  }

  async ngOnInit() {
    this.version.apiVersion().subscribe(v => {
      this.currentVersion = v[0];
      this.championData.getChampionIcons(this.currentVersion).subscribe(championData => {
        try {
          // @ts-ignore
          for (const champion in championData.data) {
            const src = `https://ddragon.leagueoflegends.com/cdn/${this.currentVersion}/img/champion/${champion}.png`;
            this.championImages.push({
              src: src,
              alt: champion
            });
          }
        } catch (err) {
          console.log(err);
        }
      })
    })
  }

  public async getSkins(alt: string) {
    this.skinsImages = [];
    this.showingSkins = true;
    try {
      this.championData.getSkins(this.currentVersion, alt).subscribe(champion => {
        const skins = champion["data"][alt]["skins"];
        for (let i = 0; i < skins.length; i++) {
          this.skinsImages.push({
            src: `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${alt}_${skins[i]["num"]}.jpg`,
            alt: skins[i]["id"]
          });
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  public setBackground(id: string) {
    const body = {
      key: "backgroundSkinId",
      value: parseInt(id)
    };
    this.lcuConnectionService.requestSend(body, 'POST', 'profile').then(response => {
      this.dialog.open(DialogComponent, {
        data: {body: response}
      });
    });
  }
}
