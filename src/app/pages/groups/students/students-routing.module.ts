import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {StudentsPage} from './students.page';

const routes: Routes = [
  { path: '', component: StudentsPage },
  {
    path: 'pending-activities',
    loadChildren: () => import('./pending-activities/pending-activities.module').then(m => m.PendingActivitiesPageModule)
  },
  { path: 'upload-students',
    loadChildren: () => import('./upload-students/upload-students.module').then(m => m.UploadStudentsPageModule)
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentsPageRoutingModule {}
