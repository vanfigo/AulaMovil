import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MembershipPage} from './membership.page';
import {IonicModule} from '@ionic/angular';
import {MembershipPageRoutingModule} from './membership-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    MembershipPageRoutingModule
  ],
  declarations: [
    MembershipPage
  ]
})
export class MembershipModule { }
