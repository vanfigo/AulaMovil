import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ActivitiesPageRoutingModule} from './activities-routing.module';

import {ActivitiesPage} from './activities.page';
import {ActivitiesModule} from '../../../components/activities/activities.module';
import {SharedModule} from '../../../components/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivitiesPageRoutingModule,
    ActivitiesModule,
    SharedModule
  ],
  declarations: [ActivitiesPage]
})
export class ActivitiesPageModule {}
