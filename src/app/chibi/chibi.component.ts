import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../core/dialog/dialog.component";
import {LCUConnectionService} from "../core/services/lcuconnection/lcuconnection.service";

@Component({
  selector: 'app-chibi',
  templateUrl: './chibi.component.html',
  styleUrls: ['./chibi.component.css']
})
export class ChibiComponent {

  constructor(public dialog: MatDialog, private lcuConnectionService: LCUConnectionService) {
  }

  public chibiIcon(id: number) {
    const body = {
      profileIconId: id
    };
    this.lcuConnectionService.requestSend(body, 'PUT', 'chibiIcon').then(response => {
      this.dialog.open(DialogComponent, {
        data: {body: response}
      });
    });
  }
}
