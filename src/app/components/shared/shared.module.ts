import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EmptyListComponent} from './empty-list/empty-list.component';
import {IonicModule} from '@ionic/angular';


@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [
    EmptyListComponent
  ],
  exports: [
    EmptyListComponent
  ]
})
export class SharedModule { }
