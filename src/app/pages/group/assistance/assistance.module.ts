import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {AssistancePageRoutingModule} from './assistance-routing.module';

import {AssistancePage} from './assistance.page';
import {StudentsModule} from '../../../components/students/students.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssistancePageRoutingModule,
    StudentsModule
  ],
  declarations: [AssistancePage]
})
export class AssistancePageModule {}
