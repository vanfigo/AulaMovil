import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {HomePageRoutingModule} from './home-routing.module';

import {HomePage} from './home.page';
import {GroupsModule} from '../../components/groups/groups.module';
import {SchoolYearModule} from '../../components/school-year/school-year.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SchoolYearModule,
    GroupsModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
