import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ModalActivitiesOverviewComponent} from './modal-activities-overview.component';
import {ActivitiesSelectionComponent} from './activities-selection/activities-selection.component';
import {StudentSelectionComponent} from './student-selection/student-selection.component';


@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [
    ModalActivitiesOverviewComponent,
    ActivitiesSelectionComponent,
    StudentSelectionComponent
  ],
  exports: [
    ActivitiesSelectionComponent,
    StudentSelectionComponent
  ],
  entryComponents: [
    ModalActivitiesOverviewComponent
  ]
})
export class ModalActivitiesOverviewModule { }
