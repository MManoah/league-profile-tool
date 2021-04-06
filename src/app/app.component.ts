import {Component} from '@angular/core';
import {ElectronService} from './core/services';
import {LCUConnection} from "./core/connector/LCUConnection";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private electronService: ElectronService) {
    const clientConnection = new electronService.LCUConnector();
    try {
      const file = electronService.fs.readFileSync("config\\clientPath.txt").toString(); // Will throw exception if file does not exist
      const path = file.split("\\").join("/");
      if (path !== "") {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        clientConnection._dirPath = path; // Use user specified client path
      }
    } catch (err) {
      const dialogOptions = {
        type: "error",
        title: "Error",
        message: "There was an error reading the client path from user config. Please check the file config/clientPath.txt",
      };
      electronService.dialog.showMessageBox(dialogOptions);
    }
    clientConnection.on('connect', (data: Record<string, unknown>) => {
      /* eslint-disable @typescript-eslint/restrict-template-expressions */
      const url = `${data["protocol"]}://${data["address"]}:${data["port"]}`;
      const auth = "Basic " + btoa(`${data["username"]}:${data["password"]}`);
      /* eslint-disable @typescript-eslint/restrict-template-expressions */
      LCUConnection.initInstance(url, auth);
      clientConnection.stop();
    });
    clientConnection.start();
  }
}
