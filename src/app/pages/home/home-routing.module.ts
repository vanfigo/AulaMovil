import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomePage} from './home.page';
import {DeactivateGuard} from '../../guards/deactivate.guard';

const routes: Routes = [
  { path: '', component: HomePage, canDeactivate: [DeactivateGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
