import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GroupsComponent} from './groups.component';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  declarations: [
    GroupsComponent
  ],
  exports: [
    GroupsComponent
  ]
})
export class GroupsModule { }
