import {Component} from '@angular/core';
import {LCUConnection} from "../connector/LCUConnection";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../dialog/dialog.component";

@Component({
  selector: 'app-chibi',
  templateUrl: './chibi.component.html',
  styleUrls: ['./chibi.component.css']
})
export class ChibiComponent {

  constructor(public dialog: MatDialog) {
  }

  public chibiIcon(id: number): void {
    const body = {
      profileIconId: id
    };
    LCUConnection.instance.requestSend(body, 'PUT', 'chibiIcon').then(response => {
      this.dialog.open(DialogComponent, {
        data: {body: response}
      });
    });
  }
}
