import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GroupCardComponent} from './group-card.component';
import {IonicModule} from '@ionic/angular';
import {PipesModule} from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PipesModule
  ],
  declarations: [
    GroupCardComponent
  ],
  exports: [
    GroupCardComponent
  ]
})
export class GroupCardModule { }
