import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {UploadStudentsPageRoutingModule} from './upload-students-routing.module';

import {UploadStudentsPage} from './upload-students.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadStudentsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [UploadStudentsPage]
})
export class UploadStudentsPageModule {}
