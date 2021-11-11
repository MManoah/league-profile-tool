import {Component, OnInit} from '@angular/core';
import {ElectronService} from "../core/services";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public title = 'LEAGUE PROFILE TOOL';
  public currentVersion = 'V.2.4.9';
  public newestVersion = '';
  private _remote = new ElectronService().shell; // To open the default browser window for links instead of making a new electron window

  constructor() {
  }

  async ngOnInit() {
    try {
      const url = 'https://raw.githubusercontent.com/MManoah/league-profile-tool/master/version.json';
      const obj = await (await fetch(url)).json();
      this.newestVersion = obj.version;
    } catch (error){
      this.newestVersion = this.currentVersion;
    }
  }

  public github() {
    this._remote.openExternal('https://github.com/MManoah/league-profile-tool');
  }

  public youtube() {
    this._remote.openExternal('https://www.youtube.com/c/mmanoah');
  }
}
