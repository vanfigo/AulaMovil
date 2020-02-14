import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {StudentsPage} from './students.page';
import {StudentsPageRoutingModule} from './students-routing.module';
import {SharedModule} from '../../../components/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudentsPageRoutingModule,
    SharedModule
  ],
  declarations: [StudentsPage]
})
export class StudentsPageModule {}
