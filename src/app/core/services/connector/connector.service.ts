import { Injectable } from '@angular/core';
import { ElectronService } from "..";
import {Options} from "./options";
import {Data} from "./data";

@Injectable({
  providedIn: 'root'
})
export class ConnectorService {
  connector: Options;
  constructor(electronService: ElectronService) {
    const clientConnection = new electronService.LCUConnector();
    try {
      const file = electronService.fs.readFileSync("config\\clientPath.txt").toString(); // Will throw exception if file does not exist
      const path = file.split("\\").join("/");
      if (path !== "") {
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
    clientConnection.on('connect', (data: Data) => {
      this.connector = {
        rejectUnauthorized: false,
        headers: {
          Accept: "application/json",
          Authorization: "Basic " + btoa(`${data["username"]}:${data["password"]}`)
        },
        url: `${data["protocol"]}://${data["address"]}:${data["port"]}`
      }
      clientConnection.stop();
    });
    clientConnection.start();
  }
}
