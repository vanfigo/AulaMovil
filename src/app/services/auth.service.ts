import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth, User} from 'firebase';
import {Router} from '@angular/router';
import {ReplaySubject} from 'rxjs';
import {Plugins} from '@capacitor/core';
import {Platform} from '@ionic/angular';
import {StorageService} from './storage.service';
import IdTokenResult = firebase.auth.IdTokenResult;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: User;
  $userRetrieved = new ReplaySubject<boolean>(1);

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private platform: Platform,
              private storageService: StorageService) {
    afAuth.authState.subscribe(user => {
      console.log(user);
      if (user) {
        afAuth.idTokenResult.subscribe((data: IdTokenResult) => {
          console.log(data.claims);
          if (this.router.url.startsWith('/login')) {
            this.router.navigateByUrl('home');
          }
          this.session = user;
        });
      } else {
        router.navigateByUrl('login');
        this.session = null;
      }
    });
  }

  set session(user: User) {
    this.user = user;
    this.$userRetrieved.next(!!user);
  }

  googleSignIn = async () => {
    if (this.platform.is('capacitor')) {
      Plugins.GoogleAuth.signIn()
        .then(googleUser => {
          const oAuthCredential = auth.GoogleAuthProvider.credential(googleUser.authentication.idToken);
          this.afAuth.auth.signInWithCredential(oAuthCredential)
            .then((credential) => {
              // console.log(credential.additionalUserInfo.isNewUser);
              // if (credential.additionalUserInfo.isNewUser) {
              //   this.router.navigateByUrl('');
              // }
            })
            .catch(console.error);
        })
        .catch();
    } else {
      const provider = new auth.GoogleAuthProvider().setCustomParameters({ prompt: 'select_account' });
      this.afAuth.auth.signInWithPopup(provider)
        .then((credential) => {
          // console.log(credential.additionalUserInfo.isNewUser);
          // if (credential.additionalUserInfo.isNewUser) {
          //   this.router.navigateByUrl('');
          // }
        })
        .catch(console.error);
    }
  }

  signOut = async () => {
    await this.storageService.remove('schoolYear');
    await this.afAuth.auth.signOut();
  }
}
