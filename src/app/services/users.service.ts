import {Injectable} from '@angular/core';
import {AngularFirestore, DocumentData, DocumentSnapshot} from '@angular/fire/firestore';
import {AuthService} from './auth.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  collectionName = 'users';

  constructor(private db: AngularFirestore,
              private authService: AuthService) { }

  getDocumentUser = () => this.db.collection(this.collectionName).doc(this.authService.user.uid);

  get = () => this.getDocumentUser().get().pipe(map((snapshot: DocumentSnapshot<DocumentData>) => snapshot.data() ));

  setDefaultPayment = (defaultPaymentId: string) => this.getDocumentUser().update({defaultPaymentId});


}
