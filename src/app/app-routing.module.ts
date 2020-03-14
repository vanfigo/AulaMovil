import {NgModule} from '@angular/core';
import {NoPreloading, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule) },
  { path: 'home'/*, canActivate: [HomeGuardService]*/,
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule) },
  { path: 'group', loadChildren: () => import('./pages/groups/group.module').then(m => m.GroupModule) },
  { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule) },
  { path: 'subscription', loadChildren: () => import('./pages/subscription/subscription.module').then(m => m.SubscriptionModule) },
  { path: 'help', loadChildren: () => import('./pages/help/help.module').then( m => m.HelpPageModule) },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
