import {Component, OnInit} from '@angular/core';
import {DialogComponent} from "../core/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {Sort} from '@angular/material/sort';
import {LCUConnectionService} from "../core/services/lcuconnection/lcuconnection.service";


@Component({
  selector: 'app-champion-purchase-date',
  templateUrl: './champion-purchase-date.component.html',
  styleUrls: ['./champion-purchase-date.component.css']
})
export class ChampionPurchaseDateComponent implements OnInit {
  public ownedChamps = null;
  public showingSkins = false;
  public searchText: string;
  public sortedData = [];
  public currentVersion = 0;
  private championData = [];

  constructor(public dialog: MatDialog, private lcuConnectionService: LCUConnectionService) {
  }

  async ngOnInit(): Promise<void> {
    const url = "https://ddragon.leagueoflegends.com/api/versions.json";
    await (await fetch(url)).json().then(versions => {
      this.currentVersion = versions[0];
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public sortData(sort: Sort) {
    const data = this.championData.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.name.toLowerCase(), b.name.toLowerCase(), isAsc);
        case 'purchased':
          return compare(a.purchasedHidden, b.purchasedHidden, isAsc);
        default:
          return 0;
      }
    });
  }

  public showSkins(champion: Record<string, unknown>): void {
    this.showingSkins = true;
    this.championData = [];
    this.championData.push({
      name: champion.alt,
      purchased: champion.purchased,
      purchasedHidden: champion.purchasedHidden
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    for (let i = 0; i < champion.skins.length; i++) {
      this.championData.push({
        name: champion.skins[i].name,
        purchased: champion.skins[i].purchased,
        purchasedHidden: champion.skins[i].purchasedHidden
      });
    }
    this.sortedData = this.championData.slice();
  }

  public getOwnership(): void {
    this.ownedChamps = [];
    this.lcuConnectionService.requestCustomAPI({}, 'GET', '/lol-summoner/v1/current-summoner').then(response => {
      if (typeof response !== 'string') {
        this.dialog.open(DialogComponent, {
          data: {body: response}
        });
      } else {
        const summonerID = JSON.parse(response).summonerId;
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        this.lcuConnectionService.requestCustomAPI({}, 'GET', `/lol-champions/v1/inventories/${summonerID}/champions`).then(ownedC => {
          if (typeof response !== 'string') {
            this.dialog.open(DialogComponent, {
              data: {body: response}
            });
          } else {
            // Fix fiddlesticks
            const champions = JSON.parse(ownedC);
            for (let i = 0; i < champions.length; i++) {
              if (champions[i].ownership.owned) {
                const o = {
                  alt: champions[i].alias,
                  purchased: new Date(champions[i].purchased).toLocaleString("en-US"),
                  purchasedHidden: champions[i].purchased,
                  skins: []
                };
                for (let j = 1; j < champions[i].skins.length; j++) {
                  if (champions[i].skins[j].ownership.owned) {
                    o.skins.push({
                      name: champions[i].skins[j].name,
                      purchased: new Date(champions[i].skins[j].ownership.rental.purchaseDate).toLocaleString("en-US"),
                      purchasedHidden: champions[i].skins[j].ownership.rental.purchaseDate
                    });
                  }
                }
                this.ownedChamps.push(o);
              }
            }
          }
        });
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
