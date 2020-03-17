import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {SummaryPage} from './summary.page';

const routes: Routes = [
  {
    path: '',
    component: SummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SummaryPageRoutingModule {}
