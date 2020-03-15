import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {SummaryPageRoutingModule} from './summary-routing.module';

import {SummaryPage} from './summary.page';
import {ChartsModule} from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SummaryPageRoutingModule,
    ChartsModule
  ],
  declarations: [SummaryPage]
})
export class SummaryPageModule {}
