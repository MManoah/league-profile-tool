import {Component} from '@angular/core';
import {ElectronService} from './core/services';
import {LCUConnection} from "./connector/LCUConnection";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private electronService: ElectronService) {
    let clientConnection: any;
    try {
      const file = electronService.fs.readFileSync("config\\clientPath.txt").toString(); // Will throw exception if file does not exist
      const path = file.split("\\").join("/");
      if (path !== "") clientConnection = new electronService.LCUConnector(path); // Use user specified client path
      else clientConnection = new electronService.LCUConnector(); // Make connection if clientPath.txt is empty
    } catch (err) {
      const dialogOptions = {
        type: "error",
        title: "Error",
        message: "There was an error reading the client path from user config. Please check the file config/clientPath.txt",
      };
      electronService.dialog.showMessageBox(dialogOptions);
      clientConnection = new electronService.LCUConnector(); // Try to make the connection if fs throws exception
    }
    clientConnection.on('connect', (data: Record<string, unknown>) => {
      /* eslint-disable @typescript-eslint/restrict-template-expressions */
      const url = `${data["protocol"]}://${data["address"]}:${data["port"]}`;
      const auth = "Basic " + btoa(`${data["username"]}:${data["password"]}`);
      /* eslint-disable @typescript-eslint/restrict-template-expressions */
      LCUConnection.initInstance(url, auth);
    });
    clientConnection.start();
  }
}
