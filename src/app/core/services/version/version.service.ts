import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  constructor(private http: HttpClient) {
  }

  apiVersion(){
    return this.http.get("https://ddragon.leagueoflegends.com/api/versions.json");
  }
}
