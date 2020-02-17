import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AssistanceReportRoutingModule} from './assistance-report-routing.module';
import {StudentSelectionPage} from './student-selection/student-selection.page';
import {AssistanceCardPage} from './assistance-card/assistance-card.page';
import {IonicModule} from '@ionic/angular';
import {SharedModule} from '../../components/shared/shared.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AssistanceReportRoutingModule,
    SharedModule,
    FormsModule
  ],
  declarations: [
    StudentSelectionPage,
    AssistanceCardPage
  ]
})
export class AssistanceReportModule { }
