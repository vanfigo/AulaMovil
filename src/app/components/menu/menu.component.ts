import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {MenuController, NavController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(public authService: AuthService,
              public menuController: MenuController,
              private navController: NavController,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {}

  getProfileURL = () => this.authService.user.photoURL ?
    this.authService.user.photoURL : 'https://img.icons8.com/cotton/gender-neutral-user--v1'

  getDisplayName = () => this.authService.user.displayName ? this.authService.user.displayName : this.authService.user.email;

  showProfilePage = () => {
    this.navController.navigateForward(['../profile'], { relativeTo: this.activatedRoute })
      .then(() => this.menuController.close());
  }

}
