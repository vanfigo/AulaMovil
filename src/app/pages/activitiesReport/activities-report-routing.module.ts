import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ActivitiesSelectionPage} from './activities-selection/activities-selection.page';
import {StudentSelectionPage} from './student-selection/student-selection.page';
import {ReportCardPage} from './report-card/report-card.page';

const routes: Routes = [
  { path: 'activities', component: ActivitiesSelectionPage },
  { path: 'students', component: StudentSelectionPage },
  { path: 'reportCard', component: ReportCardPage },
  { path: '**', redirectTo: 'activities', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivitiesReportRoutingModule {}
