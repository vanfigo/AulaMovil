import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth, User} from 'firebase';
import {Router} from '@angular/router';
import {ReplaySubject} from 'rxjs';
import IdTokenResult = firebase.auth.IdTokenResult;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: User;
  $userRetrieved = new ReplaySubject<boolean>(1);

  constructor(private afAuth: AngularFireAuth,
              private router: Router) {
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

  googleSignIn = () => this.afAuth.auth.signInWithPopup(
    new auth.GoogleAuthProvider().setCustomParameters({ prompt: 'select_account' }))

  signOut = () => this.afAuth.auth.signOut()
}
