import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {TransferPageRoutingModule} from './transfer-routing.module';

import {TransferPage} from './transfer.page';
import {ModalGroupsModule} from '../../components/modal-groups/modal-groups.module';
import {PipesModule} from '../../pipes/pipes.module';
import {GroupCardModule} from '../../components/group-card/group-card.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransferPageRoutingModule,
    ModalGroupsModule,
    GroupCardModule,
    PipesModule
  ],
  declarations: [TransferPage]
})
export class TransferPageModule {}
