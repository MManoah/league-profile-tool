import {Component} from '@angular/core';
import {LCUConnectionService} from "./core/services/lcuconnection/lcuconnection.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private lcuConnection: LCUConnectionService) {
  }
}
