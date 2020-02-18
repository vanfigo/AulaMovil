import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PendingActivitiesPipe} from './pending-activities.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PendingActivitiesPipe
  ],
  exports: [
    PendingActivitiesPipe
  ]
})
export class PipesModule { }
