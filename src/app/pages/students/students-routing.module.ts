import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {StudentsPage} from './students.page';

const routes: Routes = [
  {
    path: '',
    component: StudentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentsPageRoutingModule {}
