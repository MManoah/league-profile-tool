import {Component} from '@angular/core';
import {LCUConnection} from "../core/connector/LCUConnection";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../core/dialog/dialog.component";

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent {
  public text = '';

  constructor(public dialog: MatDialog) {
  }

  public setStatus(): void {
    const body = {
      statusMessage: this.text
    };
    LCUConnection.instance.requestSend(body, 'PUT', 'lolChat').then(response => {
      this.dialog.open(DialogComponent, {
        data: {body: response}
      });
    });
  }
}
