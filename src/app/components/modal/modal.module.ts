import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalActivitiesModule} from './modal-activities/modal-activities.module';
import {ModalActivityGradesModule} from './modal-activity-grades/modal-activity-grades.module';


@NgModule({
  imports: [
    CommonModule,
    ModalActivitiesModule,
    ModalActivityGradesModule
  ],
  declarations: []
})
export class ModalModule { }
