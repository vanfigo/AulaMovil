import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PendingActivitiesPipe} from './pending-activities.pipe';
import {UriSanitizerPipe} from './uri-sanitizer.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PendingActivitiesPipe,
    UriSanitizerPipe
  ],
  exports: [
    PendingActivitiesPipe,
    UriSanitizerPipe
  ]
})
export class PipesModule { }
