import {PaymentMethod} from '@stripe/stripe-js';

export class Payment {
  id: string;
  brand: string;
  country: string;
  expMonth: number;
  expYear: number;
  lastFour: string;

  constructor(paymentMethod?: PaymentMethod) {
    if (paymentMethod) {
      this.id = paymentMethod.id;
      this.brand = paymentMethod.card.brand;
      this.country = paymentMethod.card.country;
      this.expMonth = paymentMethod.card.exp_month;
      this.expYear = paymentMethod.card.exp_year;
      this.lastFour = paymentMethod.card.last4;
    }
  }

}
