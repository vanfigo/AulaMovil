import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {StudentsPage} from './students.page';
import {StudentsModule} from '../../../components/students/students.module';
import {StudentsPageRoutingModule} from './students-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudentsPageRoutingModule,
    StudentsModule
  ],
  declarations: [StudentsPage]
})
export class StudentsPageModule {}
