import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {MenuComponent} from './menu.component';
import {MembershipModule} from '../../pages/membership/membership.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    MembershipModule
  ],
  declarations: [
    MenuComponent
  ],
  exports: [
    MenuComponent
  ]
})
export class MenuModule { }
