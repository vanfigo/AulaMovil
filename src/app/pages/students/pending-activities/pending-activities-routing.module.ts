import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PendingActivitiesPage} from './pending-activities.page';

const routes: Routes = [
  {
    path: '',
    component: PendingActivitiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PendingActivitiesPageRoutingModule {}
