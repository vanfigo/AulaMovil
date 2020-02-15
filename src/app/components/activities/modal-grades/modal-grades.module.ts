import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalGradesComponent} from './modal-grades.component';
import {IonicModule} from '@ionic/angular';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ],
  declarations: [
    ModalGradesComponent
  ],
  entryComponents: [
    ModalGradesComponent
  ]
})
export class ModalGradesModule { }
