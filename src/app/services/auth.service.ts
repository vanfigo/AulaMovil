import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth, User} from 'firebase';
import {Router} from '@angular/router';
import {ReplaySubject, Subscription} from 'rxjs';
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
  claimsSub = new Subscription();

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private platform: Platform,
              private storageService: StorageService) {
    afAuth.authState.subscribe(user => {
      console.log(user);
      if (user) {
        this.claimsSub = afAuth.idTokenResult.subscribe((data: IdTokenResult) => {
          console.log(data.claims);
          if (this.router.url.startsWith('/login')) {
            this.router.navigateByUrl('home');
          }
          this.session = user;
        });
      } else {
        storageService.get('hideLandingPage')
          .then(async (hideLandingPage) => {
            if (hideLandingPage) {
              await router.navigateByUrl('login');
            } else {
              await router.navigateByUrl('landing');
            }
            this.session = null;
          });
      }
    });
  }

  set session(user: User) {
    this.user = user;
    this.$userRetrieved.next(true);
  }

  emailSignUp = (email: string, password: string) => this.afAuth.auth.createUserWithEmailAndPassword(email, password);

  emailSignIn = (email: string, password: string) => this.afAuth.auth.signInWithEmailAndPassword(email, password);

  googleSignIn = async () => {
    if (this.platform.is('capacitor')) {
      return Plugins.GoogleAuth.signIn()
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
        .catch(console.error);
    } else {
      const provider = new auth.GoogleAuthProvider().setCustomParameters({ prompt: 'select_account' });
      return this.afAuth.auth.signInWithPopup(provider)
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
    this.claimsSub.unsubscribe();
    await this.storageService.remove('schoolYear');
    await this.afAuth.auth.signOut();
  }
}
