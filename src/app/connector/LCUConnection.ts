import {ElectronService} from "../core/services";
import {endpoints} from "./endpoints";

export class LCUConnection {
  private static _instance: LCUConnection = null;
  private readonly _options: Record<string, unknown>;
  private _endpoints = endpoints;
  private _services: ElectronService;

  private constructor(ur: string, auth: string) {
    this._services = new ElectronService();
    this._options = {
      rejectUnauthorized: false,
      headers: {
        Accept: "application/json",
        Authorization: auth,
      },
      url: ur,
    };
  }

  static initInstance(url: string, auth: string): void {
    if (this._instance === null) this._instance = new LCUConnection(url, auth);
  }

  static get instance(): LCUConnection {
    return this._instance;
  }

  public async requestSend(body: Record<string, unknown>, method: string, endpoint: string): Promise<any> {
    return await this.makeRequest(method, body, this._endpoints[endpoint], false);
  }

  public async requestCustomAPI(body: Record<string, unknown>, method: string, endpoint: string): Promise<any> {
    return await this.makeRequest(method, body, endpoint, true);
  }

  private async makeRequest(method: string, body: Record<string, unknown>, endPoint: string, getFull: boolean): Promise<any> {
    const options = JSON.parse(JSON.stringify(this._options));
    options.url += endPoint;
    options.method = method;
    options.body = JSON.stringify(body);
    return await this._services.request(options)
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
