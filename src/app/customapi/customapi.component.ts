import {Component} from '@angular/core';
import {LCUConnectionService} from "../core/services/lcuconnection/lcuconnection.service";

@Component({
  selector: 'app-customapi',
  templateUrl: './customapi.component.html',
  styleUrls: ['./customapi.component.css']
})
export class CustomapiComponent {
  public methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];
  public method: string;
  public body = "{\n     \"\":\"\"\n}";
  public response: string;
  public endPoint: string;

  constructor(private lcuConnectionService: LCUConnectionService) {
  }

  public sendRequest() {
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(this.body);
    } catch (error) {
      this.response = 'Invalid JSON Format';
      return;
    }
    this.lcuConnectionService.requestCustomAPI(body, this.method, this.endPoint).then(response => {
      this.response = JSON.stringify(JSON.parse(response), null, 3);
    });
  }

}
