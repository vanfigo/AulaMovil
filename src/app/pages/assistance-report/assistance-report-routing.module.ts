import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StudentSelectionPage} from './student-selection/student-selection.page';
import {AssistanceCardPage} from './assistance-card/assistance-card.page';

const routes: Routes = [
  { path: 'students', component: StudentSelectionPage },
  { path: 'assistanceCard', component: AssistanceCardPage },
  { path: '**', redirectTo: 'students', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssistanceReportRoutingModule {}
