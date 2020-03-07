import {Component, OnInit} from '@angular/core';
import {NavController, ToastController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {AulaMovilSubscription} from '../../models/aula-movil-subscription.class';
import {SubscriptionsService} from '../../services/subscriptions.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {

  loading: boolean;
  subscription: AulaMovilSubscription;

  constructor(private navController: NavController,
              private activatedRoute: ActivatedRoute,
              private subscriptionsService: SubscriptionsService,
              private toastController: ToastController) {
    this.subscriptionsService.getActive().subscribe((subscription: AulaMovilSubscription) => {
      this.subscription = subscription;
    });
  }

  ngOnInit() {}

  showPaymentsPage = () => this.navController.navigateForward(['payments'], { relativeTo: this.activatedRoute });

  createSubscription = async () => {
    this.loading = true;
    await this.subscriptionsService.save(this.subscription);
  }

  showCancelSubscription = () => this.subscription &&
    (this.subscription.status === 'active' || this.subscription.status === 'trialing')

  showProblemsSubscription = () => this.subscription &&
    (this.subscription.status === 'incomplete' || this.subscription.status === 'past_due')

  intentSubscription = () => { };

  cancelSubscription = () => { };

}
