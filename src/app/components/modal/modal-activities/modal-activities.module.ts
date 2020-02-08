import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalActivitiesComponent} from './modal-activities.component';
import {IonicModule} from '@ionic/angular';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ],
  declarations: [
    ModalActivitiesComponent
  ],
  entryComponents: [
    ModalActivitiesComponent
  ]
})
export class ModalActivitiesModule { }
