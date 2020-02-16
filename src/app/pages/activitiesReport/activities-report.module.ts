import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from 'src/app/components/shared/shared.module';
import {ActivitiesSelectionPage} from './activities-selection/activities-selection.page';
import {ActivitiesReportRoutingModule} from './activities-report-routing.module';
import {StudentSelectionPage} from './student-selection/student-selection.page';
import {ReportCardPage} from './report-card/report-card.page';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    ReactiveFormsModule,
    ActivitiesReportRoutingModule
  ],
  declarations: [
    ActivitiesSelectionPage,
    StudentSelectionPage,
    ReportCardPage
  ]
})
export class ActivitiesReportModule { }
