import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {GroupPage} from './group.page';

const routes: Routes = [
  {
    path: '',
    component: GroupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupPageRoutingModule {}
