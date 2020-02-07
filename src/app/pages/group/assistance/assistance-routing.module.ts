import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AssistancePage} from './assistance.page';

const routes: Routes = [
  {
    path: '',
    component: AssistancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssistancePageRoutingModule {}
