import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PaymentsPage} from './payments.page';

const routes: Routes = [
  { path: '', component: PaymentsPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentsPageRoutingModule {}
