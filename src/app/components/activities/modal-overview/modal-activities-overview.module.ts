import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ModalActivitiesOverviewComponent} from './modal-activities-overview.component';
import {ActivitiesSelectionComponent} from './activities-selection/activities-selection.component';
import {StudentSelectionComponent} from './student-selection/student-selection.component';
import {SharedModule} from '../../shared/shared.module';
import {ReportCardComponent} from './report-card/report-card.component';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [
    ModalActivitiesOverviewComponent,
    ActivitiesSelectionComponent,
    StudentSelectionComponent,
    ReportCardComponent
  ],
  entryComponents: [
    ModalActivitiesOverviewComponent
  ]
})
export class ModalActivitiesOverviewModule { }
