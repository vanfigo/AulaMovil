import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ModalGroupsComponent} from './modal-groups.component';
import {PipesModule} from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PipesModule
  ],
  declarations: [
    ModalGroupsComponent
  ],
  entryComponents: [
    ModalGroupsComponent
  ]
})
export class ModalGroupsModule { }
