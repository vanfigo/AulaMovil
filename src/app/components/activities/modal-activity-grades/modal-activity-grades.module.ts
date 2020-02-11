import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalActivityGradesComponent} from './modal-activity-grades.component';
import {IonicModule} from '@ionic/angular';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ],
  declarations: [
    ModalActivityGradesComponent
  ],
  entryComponents: [
    ModalActivityGradesComponent
  ]
})
export class ModalActivityGradesModule { }
