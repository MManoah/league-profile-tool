import { Injectable } from '@angular/core';
import {ConnectorService} from "../connector/connector.service";
import {ElectronService} from "..";
import { endpoints } from "./endpoints";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LCUConnectionService {
  private readonly _endpoints = endpoints;
  constructor(private connector: ConnectorService, private electronService: ElectronService, private http: HttpClient) {
  }

  public async requestSend(body: Record<string, unknown>, method: string, endpoint: string): Promise<any> {
    return await this.makeRequest(method, body, this._endpoints[endpoint], false);
  }

  public async requestCustomAPI(body: Record<string, unknown>, method: string, endpoint: string): Promise<any> {
    return await this.makeRequest(method, body, endpoint, true);
  }

  private async makeRequest(method: string, body: Record<string, unknown>, endPoint: string, getFull: boolean): Promise<any> {
    const options = JSON.parse(JSON.stringify(this.connector.connector));
    options.url += endPoint;
    options.method = method;
    options.body = JSON.stringify(body);
    return await this.electronService.request(options)
      .then(response => {
        return new Promise(function (resolve) {
          if (!getFull) resolve('Success');
          else resolve(response);
        });
      })
      .catch(err => {
        return new Promise(function (reject) {
          reject(err.error);
        });
      });
  }

}
