import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AssistancePage} from './assistance.page';

const routes: Routes = [
  { path: '', component: AssistancePage },
  { path: 'summary', loadChildren: () => import('./summary/summary.module').then( m => m.SummaryPageModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssistancePageRoutingModule {}
