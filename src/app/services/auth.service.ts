import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth, User} from 'firebase';
import {Router} from '@angular/router';
import {ReplaySubject} from 'rxjs';
import {Plugins} from '@capacitor/core';
import {Platform} from '@ionic/angular';
import IdTokenResult = firebase.auth.IdTokenResult;

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: User;
  $userRetrieved = new ReplaySubject<boolean>(1);

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private platform: Platform) {
    afAuth.authState.subscribe(user => {
      if (user) {
        afAuth.idTokenResult.subscribe((data: IdTokenResult) => {
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
    console.log(this.platform.platforms());
    if (this.platform.is('capacitor')) {
      Plugins.GoogleAuth.signIn()
        .then(googleUser => {
          const credential = auth.GoogleAuthProvider.credential(googleUser.authentication.idToken);
          this.afAuth.auth.signInWithCredential(credential)
            .catch();
        })
        .catch();
    } else {
      this.afAuth.auth.signInWithPopup( new auth.GoogleAuthProvider().setCustomParameters({ prompt: 'select_account' }) )
        .then()
        .catch();
    }
  }

  signOut = async () => {
    await Storage.clear();
    await this.afAuth.auth.signOut();
  }
}
