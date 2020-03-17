import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {MenuComponent} from './menu.component';
import {SubscriptionModule} from '../../pages/subscription/subscription.module';
import {AboutModule} from '../about/about.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SubscriptionModule,
    AboutModule
  ],
  declarations: [
    MenuComponent
  ],
  exports: [
    MenuComponent
  ]
})
export class MenuModule { }
