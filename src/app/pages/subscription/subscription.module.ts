import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SubscriptionPage} from './subscription.page';
import {IonicModule} from '@ionic/angular';
import {SubscriptionPageRoutingModule} from './subscription-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SubscriptionPageRoutingModule
  ],
  declarations: [
    SubscriptionPage
  ]
})
export class SubscriptionModule { }
