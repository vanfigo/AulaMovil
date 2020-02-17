import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalActivitiesModule} from './modal-activities/modal-activities.module';
import {ModalGradesModule} from './modal-grades/modal-grades.module';


@NgModule({
  imports: [
    CommonModule,
    ModalActivitiesModule,
    ModalGradesModule
  ],
  declarations: []
})
export class ActivitiesModule { }
