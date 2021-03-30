import {Component} from '@angular/core';
import {LCUConnection} from "../connector/LCUConnection";

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

  constructor() {
  }

  public sendRequest(): void {
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(this.body);
    } catch (error) {
      this.response = 'Invalid JSON Format';
      return;
    }
    LCUConnection.instance.requestCustomAPI(body, this.method, this.endPoint).then(response => {
      this.response = JSON.stringify(JSON.parse(response), null, 3);
    });
  }

}
