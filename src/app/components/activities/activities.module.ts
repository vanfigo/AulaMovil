import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalActivitiesModule} from './modal-activities/modal-activities.module';
import {ModalActivityGradesModule} from './modal-activity-grades/modal-activity-grades.module';
import {ModalActivitiesOverviewModule} from './modal-activities-overview/modal-activities-overview.module';


@NgModule({
  imports: [
    CommonModule,
    ModalActivitiesModule,
    ModalActivityGradesModule,
    ModalActivitiesOverviewModule
  ],
  declarations: []
})
export class ActivitiesModule { }
