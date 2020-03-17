import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalPaymentComponent} from './modal-payment.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  declarations: [
    ModalPaymentComponent
  ],
  entryComponents: [
    ModalPaymentComponent
  ]
})
export class ModalPaymentModule { }
