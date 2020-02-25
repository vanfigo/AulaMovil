import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  { path: ':groupUid/students',
    loadChildren: () => import('./students/students.module').then(m => m.StudentsPageModule) },
  { path: ':groupUid/assistance',
    loadChildren: () => import('./assistance/assistance.module').then(m => m.AssistancePageModule) },
  { path: ':groupUid/activities',
    loadChildren: () => import('./activities/activities.module').then(m => m.ActivitiesPageModule) },
  { path: ':groupUid/activities-report',
    loadChildren: () => import('./activities-report/activities-report.module').then(m => m.ActivitiesReportModule) },
  { path: ':groupUid/assistance-report',
    loadChildren: () => import('./assistance-report/assistance-report.module').then(m => m.AssistanceReportModule) },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupRoutingModule {}
