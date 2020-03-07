import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastController} from '@ionic/angular';
import {AngularFireStorage} from '@angular/fire/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  profileFormGroup: FormGroup;
  loading = false;

  constructor(public authService: AuthService,
              private toastController: ToastController,
              private afStorage: AngularFireStorage) {
    this.profileFormGroup = new FormGroup({
      displayName: new FormControl(authService.user.displayName, [Validators.required])
    });
  }

  ngOnInit() { }

  getProfileURL = () => this.authService.user.photoURL ?
    this.authService.user.photoURL : 'https://img.icons8.com/cotton/500/gender-neutral-user--v1'

  getDisplayName = () => this.authService.user.displayName ?
    this.authService.user.displayName : this.authService.user.email

  saveProfile = () => {
    this.loading = true;
    const {displayName} = this.profileFormGroup.value;
    this.authService.user.updateProfile({ displayName }).then(this.showProfileUpdated);
  }

  updatePhoto = (photoInput: HTMLInputElement) => {
    const file: File = photoInput.files.item(0);
    if (file && file.type.startsWith('image')) {
      this.loading = true;
      this.afStorage.storage.ref(`users/${this.authService.user.uid}/profile`).child(file.name).put(file)
        .then((task) => task.ref.getDownloadURL().then((photoURL) =>
          this.authService.user.updateProfile({ photoURL }).then(this.showProfileUpdated)
      ));
    } else {
      this.toastController.create({
        message: 'El archivo no es una imagen',
        duration: 3000
      }).then(toast => toast.present());
    }
  }

  showProfileUpdated = () => this.toastController.create({
    message: 'El perfil fue actualizado exitosamente',
    duration: 3000
  }).then(toast => {
    this.loading = false;
    toast.present();
  })

  verifyEmail = () => {
    this.loading = true;
    this.authService.user.sendEmailVerification()
      .then((data) => this.toastController.create({
        message: 'Se ha enviado un correo de verificación',
        duration: 3000
      }).then(toast => toast.present()))
      .catch((data) => this.toastController.create({
        message: 'Se ha producido un error, intentalo mas tarde',
        color: 'danger',
        duration: 3000
      }).then(toast => toast.present()))
      .finally(() => this.loading = false);
  }

}
