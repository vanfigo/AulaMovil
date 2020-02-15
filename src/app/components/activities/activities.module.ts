import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalActivitiesModule} from './modal-activities/modal-activities.module';
import {ModalGradesModule} from './modal-grades/modal-grades.module';
import {ModalActivitiesOverviewModule} from './modal-overview/modal-activities-overview.module';


@NgModule({
  imports: [
    CommonModule,
    ModalActivitiesModule,
    ModalGradesModule,
    ModalActivitiesOverviewModule
  ],
  declarations: []
})
export class ActivitiesModule { }
