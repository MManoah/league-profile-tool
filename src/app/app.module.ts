import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CoreModule} from './core/core.module';
import {MatTabsModule} from '@angular/material/tabs';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {StatusComponent} from './status/status.component';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from "@angular/material/dialog";
import {DialogComponent} from './core/dialog/dialog.component';
import {ChibiComponent} from './chibi/chibi.component';
import {BackgroundComponent} from './background/background.component';
import {ChampionsPipe} from './core/pipes/champions/champions.pipe';
import {ChatrankComponent} from './chatrank/chatrank.component';
import {ChampionPurchaseDateComponent} from './champion-purchase-date/champion-purchase-date.component';
import {MatSortModule} from "@angular/material/sort";
import {CustomapiComponent} from './customapi/customapi.component';
import {FaqComponent} from './faq/faq.component';
import { CustomiconComponent } from './customicon/customicon.component';
import { IconsPipe } from './core/pipes/icons/icons.pipe';
import { PracticetoolComponent } from './practicetool/practicetool.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, StatusComponent, DialogComponent, ChibiComponent, BackgroundComponent, ChampionsPipe, ChatrankComponent, ChampionPurchaseDateComponent, CustomapiComponent, FaqComponent, CustomiconComponent, IconsPipe, PracticetoolComponent],
  imports: [
    BrowserModule,
    FormsModule,
    CoreModule,
    AppRoutingModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatSortModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
