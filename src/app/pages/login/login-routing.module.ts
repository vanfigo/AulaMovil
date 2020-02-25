import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LoginPage} from './login.page';

const routes: Routes = [
  { path: '', component: LoginPage },
  { path: 'sign-in', loadChildren: () => import('./sign-in/sign-in.module').then( m => m.SignInPageModule) },
  { path: 'sign-up', loadChildren: () => import('./sign-up/sign-up.module').then( m => m.SignUpPageModule) },
  // { path: '**', redirectTo: 'sign-in', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
