import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MembershipPage} from './membership.page';

const routes: Routes = [
  { path: '', component: MembershipPage },
  { path: 'payments', loadChildren: () => import('./payments/payments.module').then( m => m.PaymentsPageModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MembershipPageRoutingModule {}
