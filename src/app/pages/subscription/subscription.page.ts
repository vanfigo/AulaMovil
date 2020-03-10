import {Component, OnInit} from '@angular/core';
import {NavController, ToastController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {AulaMovilSubscription} from '../../models/aula-movil-subscription.class';
import {SubscriptionsService} from '../../services/subscriptions.service';
import {AulaMovilUser} from '../../models/aula-movil-user.class';
import {UsersService} from '../../services/users.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {

  loading = true;
  subscription: AulaMovilSubscription;

  constructor(private navController: NavController,
              private activatedRoute: ActivatedRoute,
              private subscriptionsService: SubscriptionsService,
              private toastController: ToastController,
              private usersService: UsersService) {
    this.subscriptionsService.getActive().subscribe((subscription: AulaMovilSubscription) => {
      this.subscription = subscription;
      this.loading = false;
    });
  }

  ngOnInit() {}

  showPaymentsPage = () => this.navController.navigateForward(['payments'], { relativeTo: this.activatedRoute });

  createSubscription = async () => {
    this.loading = true;
    this.usersService.get().toPromise().then((document: AulaMovilUser) => {
      if (document.defaultPaymentId === undefined) {
        this.toastController.create({
          message: 'Selecciona un método de pago',
          duration: 3000
        }).then(toast => {
          toast.present();
          this.loading = false;
        });
      } else {
        this.subscriptionsService.save(this.subscription);
      }
    });
  }

  showCancelSubscription = () => this.subscription &&
    (this.subscription.status === 'active' || this.subscription.status === 'trialing')

  showProblemsSubscription = () => this.subscription &&
    (this.subscription.status === 'incomplete' || this.subscription.status === 'past_due')

  intentSubscription = () => { };

  cancelSubscription = () => { };

}
