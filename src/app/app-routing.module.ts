import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule) },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule) },
  { path: 'group/:groupUid/students',
    loadChildren: () => import('./pages/students/students.module').then(m => m.StudentsPageModule) },
  { path: 'group/:groupUid/assistance',
    loadChildren: () => import('./pages/assistance/assistance.module').then(m => m.AssistancePageModule) },
  { path: 'group/:groupUid/activities',
    loadChildren: () => import('./pages/activities/activities.module').then(m => m.ActivitiesPageModule) },
  { path: 'group/:groupUid/activitiesReport',
    loadChildren: () => import('./pages/activitiesReport/activities-report.module').then(m => m.ActivitiesReportModule) },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
