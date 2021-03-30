import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, shell, dialog } from 'electron';
import * as remote from '@electron/remote';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as request from 'request-promise';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as LCUConnector from "lcu-connector";

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  LCUConnector: typeof LCUConnector;
  shell: typeof shell;
  dialog: typeof dialog;
  request: typeof request;
  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.shell = window.require('electron').shell;
      // If you want to use remote object in renderer process, please set enableRemoteModule to true in main.ts
      // this.remote = window.require('@electron/remote');
      // console.log('remote - globalShortcut', this.remote.globalShortcut);

      this.request = window.require('request-promise');
      this.dialog = window.require('electron').remote.dialog;
      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.LCUConnector = window.require('lcu-connector');
    }
  }
}
