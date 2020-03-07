import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SubscriptionPage} from './subscription.page';

const routes: Routes = [
  { path: '', component: SubscriptionPage },
  { path: 'payments', loadChildren: () => import('./payments/payments.module').then( m => m.PaymentsPageModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionPageRoutingModule {}
