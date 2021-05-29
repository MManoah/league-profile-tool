import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ChampionService {

  constructor(private http: HttpClient) { }

  getChampionIcons(version: string){
    return this.http.get(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`);
  }

  getSkins(version: string, alt: string){
    return this.http.get(`http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion/${alt}.json`);
  }

  getSummonerIcons(){
    return this.http.get("https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/summoner-icons.json");
  }
}
