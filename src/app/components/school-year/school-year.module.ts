import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SchoolYearComponent} from './school-year.component';
import {IonicModule} from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [
    SchoolYearComponent
  ],
  exports: [
    SchoolYearComponent
  ]
})
export class SchoolYearModule { }
