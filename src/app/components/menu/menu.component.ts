import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {MenuController, ModalController, NavController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(private afAuth: AngularFireAuth,
              public authService: AuthService,
              public menuController: MenuController,
              private navController: NavController,
              private activatedRoute: ActivatedRoute,
              private modalController: ModalController) { }

  ngOnInit() {}

  getProfileURL = () => this.afAuth.auth.currentUser.photoURL ?
    this.afAuth.auth.currentUser.photoURL : 'https://img.icons8.com/cotton/gender-neutral-user--v1'

  getDisplayName = () => this.afAuth.auth.currentUser.displayName ?
    this.afAuth.auth.currentUser.displayName : this.afAuth.auth.currentUser.email

  showProfilePage = () => {
    this.navController.navigateForward(['../profile'], { relativeTo: this.activatedRoute })
      .then(() => this.menuController.close());
  }

  showMembership = () => {
    this.navController.navigateForward(['../membership'], { relativeTo: this.activatedRoute })
      .then(() => this.menuController.close());
  }

  signOut = () => this.menuController.close().then(this.authService.signOut);

}
