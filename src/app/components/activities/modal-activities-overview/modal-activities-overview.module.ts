import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ModalActivitiesOverviewComponent} from './modal-activities-overview.component';
import {ActivitiesSelectionComponent} from './activities-selection/activities-selection.component';
import {StudentSelectionComponent} from './student-selection/student-selection.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule
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
