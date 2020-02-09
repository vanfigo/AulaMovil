import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ActivitiesPage} from './activities.page';
import {DeactivateGuard} from '../../../guards/deactivate.guard';

const routes: Routes = [
  { path: '', component: ActivitiesPage, canDeactivate: [DeactivateGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivitiesPageRoutingModule {}
