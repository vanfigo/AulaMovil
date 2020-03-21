import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {MenuController, ModalController, NavController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {AboutComponent} from '../about/about.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(public authService: AuthService,
              public menuController: MenuController,
              private navController: NavController,
              private activatedRoute: ActivatedRoute,
              private modalController: ModalController) { }

  ngOnInit() {}

  getProfileURL = () => (this.authService.user && this.authService.user.photoURL) ?
    this.authService.user.photoURL : 'https://img.icons8.com/cotton/gender-neutral-user--v1'

  getDisplayName = () => this.authService.user ? (this.authService.user.displayName ?
    this.authService.user.displayName : this.authService.user.email) : ''

  showProfilePage = () => this.navController
    .navigateForward(['../profile'], { relativeTo: this.activatedRoute }).then(() => this.menuController.close())

  showSubscription = () => this.navController
    .navigateForward(['../subscription'], { relativeTo: this.activatedRoute }).then(() => this.menuController.close())

  showAboutComponent = () => this.modalController.create({
    component: AboutComponent
  }).then(modal => modal.present().then(() => this.menuController.close()))

  showHelpPage = () => this.navController
    .navigateForward(['../help'], { relativeTo: this.activatedRoute }).then(() => this.menuController.close())

  showTransferPage = () => this.navController
    .navigateForward(['../transfer'], { relativeTo: this.activatedRoute }).then(() => this.menuController.close())

  signOut = () => this.menuController.close().then(this.authService.signOut);

}
