import {Component, OnInit, ViewChild} from '@angular/core';
import {PaymentService} from '../../../services/payment.service';
import {IonRadioGroup, ModalController, ToastController} from '@ionic/angular';
import {ModalPaymentComponent} from '../../../components/modal-payment/modal-payment.component';
import {Payment} from '../../../models/payment.class';
import {UsersService} from '../../../services/users.service';
import {AulaMovilUser} from '../../../models/aula-movil-user.class';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit {

  paymentMethods: Payment[];
  loading = true;
  @ViewChild(IonRadioGroup, {static: true}) paymentsRadioGroup: IonRadioGroup;


  constructor(private paymentService: PaymentService,
              private usersService: UsersService,
              private modalController: ModalController,
              private toastController: ToastController) {
    this.paymentService.getPaymentMethods().subscribe(async (paymentMethods: Payment[]) => {
      this.usersService.get().toPromise().then((document: AulaMovilUser) => {
        this.loading = false;
        this.paymentMethods = paymentMethods;
        this.paymentsRadioGroup.value = document.defaultPaymentId;
        this.loading = false;
      });
    });
  }

  ngOnInit() { }

  showAddPayment = async () => {
    const modal = await this.modalController.create({
      component: ModalPaymentComponent
    });
    await modal.present();
    modal.onDidDismiss()
      .then(async (data) => {
        if (data.data) {
          this.loading = true;
          const payment = new Payment(data.data);
          this.selectPaymentMethod(payment);
          this.paymentService.save(payment)
            .then(async () => {
              this.loading = false;
              this.toastController.create({
                message: `La tarjeta ${payment.lastFour} ha sido guardada exitosamente`,
                duration: 3000
              }).then(toast => toast.present());
            });
        }
      });
  }

  getBrand = (brand: string) => {
    if (brand === 'visa') {
      return 'https://img.icons8.com/color/48/visa';
    } else if (brand === 'mastercard') {
      return 'https://img.icons8.com/color/48/mastercard';
    } else {
      return 'https://img.icons8.com/color/48/bank-card-front-side';
    }
  }

  selectPaymentMethod = async (payment: CustomEvent | Payment) => {
    this.loading = true;
    let paymentId;
    if (payment instanceof Payment) {
      paymentId = payment.id;
    } else {
      paymentId = payment.detail.value;
    }
    console.log(paymentId);
    this.usersService.setDefaultPayment(paymentId).then(() => this.loading = false);
  }

}
