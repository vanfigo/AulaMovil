import {Component, OnInit} from '@angular/core';
import {LoadingController, ModalController, ToastController} from '@ionic/angular';
import {loadStripe, Stripe} from '@stripe/stripe-js';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-modal-payment',
  templateUrl: './modal-payment.component.html',
  styleUrls: ['./modal-payment.component.scss'],
})
export class ModalPaymentComponent implements OnInit {

  elements: any;
  stripe: Stripe;

  constructor(public modalController: ModalController,
              private authService: AuthService,
              private toastController: ToastController,
              private loadingController: LoadingController) { }

  async ngOnInit() {
    this.stripe = await loadStripe('pk_test_mWD5lrD4nc5sbxTtWrbmxjUS00Yv57M7uH');
    this.elements = this.stripe.elements({ locale: 'es'} );
    const card = this.elements.create('card', {
      style: {
        base: {
          color: '#222428',
          fontFamily: '"Roboto", "Helvetica Neue", sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '20px',
          '::placeholder': {
            color: '#989aa2'
          }
        },
      }
    });
    card.mount('#card-element');
  }

  addPaymentMethod = async () => {
    const card = this.elements.getElement('card');
    this.loadingController.create({
      message: 'Guardando tarjeta'
    }).then(loading =>  {
      loading.present();
      this.stripe.createPaymentMethod({
        type: 'card', card,
        billing_details: {
          email: this.authService.user.email
        }
      }).then((result) => {
        loading.dismiss();
        if (result.error) {
          this.toastController.create({
            message: result.error.message,
            color: 'danger',
            duration: 3000
          }).then(toast => toast.present());
        } else {
          this.modalController.dismiss(result.paymentMethod);
        }
      });
    });
  }

}
