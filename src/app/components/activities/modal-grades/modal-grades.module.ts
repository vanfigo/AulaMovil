import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalGradesComponent} from './modal-grades.component';
import {IonicModule} from '@ionic/angular';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    ModalGradesComponent
  ],
  entryComponents: [
    ModalGradesComponent
  ]
})
export class ModalGradesModule { }
