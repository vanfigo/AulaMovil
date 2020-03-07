import {Injectable} from '@angular/core';
import {AngularFirestore, DocumentChangeAction} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {Payment} from '../models/payment.class';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  collectionName = 'payments';

  constructor(private db: AngularFirestore,
              private authService: AuthService) { }

  getDocumentUser = () => this.db.collection('users').doc(this.authService.user.uid);

  getCollection = () => this.getDocumentUser().collection(this.collectionName);

  getPaymentMethods = () => this.getCollection().snapshotChanges().pipe(map((actions: DocumentChangeAction<Payment>[]) =>
    actions.map((action: DocumentChangeAction<Payment>) => action.payload.doc.data())
  ))

  save = (payment: Payment) => this.getCollection().doc(payment.id).set({...payment});

}
