import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ActivitiesPageRoutingModule} from './activities-routing.module';

import {ActivitiesPage} from './activities.page';
import {ModalModule} from '../../../components/modal/modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivitiesPageRoutingModule,
    ModalModule
  ],
  declarations: [ActivitiesPage]
})
export class ActivitiesPageModule {}
