import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {UploadStudentsPage} from './upload-students.page';

const routes: Routes = [
  {
    path: '',
    component: UploadStudentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadStudentsPageRoutingModule {}
