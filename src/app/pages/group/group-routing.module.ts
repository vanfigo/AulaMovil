import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {GroupPage} from './group.page';

const routes: Routes = [
  { path: ':uid', component: GroupPage, children: [
      { path: 'students', loadChildren: () => import('./students/students.module').then(m => m.StudentsPageModule) },
      { path: 'assistance', loadChildren: () => import('./assistance/assistance.module').then(m => m.AssistancePageModule) },
      { path: 'activities', loadChildren: () => import('./activities/activities.module').then(m => m.ActivitiesPageModule) },
      { path: '**', redirectTo: 'students', pathMatch: 'full' },
  ] },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupPageRoutingModule {}
