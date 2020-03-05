import {Component, OnInit} from '@angular/core';
import {NavController, ToastController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {AngularFireFunctions} from '@angular/fire/functions';
import {StorageService} from '../../services/storage.service';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.page.html',
  styleUrls: ['./membership.page.scss'],
})
export class MembershipPage implements OnInit {


  constructor(private navController: NavController,
              private activatedRoute: ActivatedRoute,
              private storageService: StorageService,
              private toastController: ToastController,
              private afFunctions: AngularFireFunctions) {
  }

  ngOnInit() {}

  showPaymentsPage = () => this.navController.navigateForward(['payments'], { relativeTo: this.activatedRoute });

  createSubscription = () => {
    this.storageService.get('defaultPayment')
      .then((defaultPayment) => {
        if (defaultPayment) {
          const createSubscription = this.afFunctions.httpsCallable('createSubscription');
          console.log(createSubscription);
          createSubscription({ defaultPaymentId: defaultPayment }).subscribe(data => {
            console.log(data);
          }, error => console.error(error));
        } else {
          this.toastController.create({
            message: 'Debes seleccionar un metodo de pago',
            duration: 3000,
            color: 'danger'
          }).then(toast => toast.present());
        }
      });
  }

}
