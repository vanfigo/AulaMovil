import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {StorageService} from '../../services/storage.service';
import {NavController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loading = false;

  constructor(public authService: AuthService,
              private storageService: StorageService,
              private navController: NavController,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() { }

  googleSignIn = () => {
    this.loading = true;
    this.authService.googleSignIn()
      .finally(() => this.loading = false);
  }

}
