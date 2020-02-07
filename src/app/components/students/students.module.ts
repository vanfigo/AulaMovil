import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StudentsComponent} from './students.component';
import {IonicModule} from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [
    StudentsComponent
  ],
  exports: [
    StudentsComponent
  ]
})
export class StudentsModule { }
