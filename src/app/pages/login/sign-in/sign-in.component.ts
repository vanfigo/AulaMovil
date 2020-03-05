import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NavController, ToastController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {

  signInFormGroup: FormGroup;
  loading = false;

  constructor(private toastController: ToastController,
              private navController: NavController,
              private activatedRoute: ActivatedRoute,
              public authService: AuthService) {
    this.signInFormGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {}

  showSignUp = () => this.navController.navigateForward(['../sign-up'], { relativeTo: this.activatedRoute });

  showErrorToast = (errorMsg: string) => {
    this.toastController.create({
      message: errorMsg,
      duration: 3000,
      color: 'danger'
    }).then(toast => toast.present());
  }

  signIn = () => {
    this.loading = true;
    const {email, password} = this.signInFormGroup.value;
    this.authService.emailSignIn(email, password)
      .catch(error => {
        if (error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password') {
          this.showErrorToast('El email o el password es incorrecto');
        } else if (error.code === 'auth/user-not-found') {
          this.showErrorToast('El usuario no esta registrado');
        }
      })
      .finally(() => this.loading = false);
  }

}
