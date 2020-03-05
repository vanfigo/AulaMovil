import {Injectable} from '@angular/core';
import {AngularFirestore, DocumentChangeAction} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {map} from 'rxjs/operators';
import {Payment} from '../models/payment.class';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  collectionName = 'payments';

  constructor(private db: AngularFirestore,
              private afAuth: AngularFireAuth) { }

  getDocumentUser = () => this.db.collection('users').doc(this.afAuth.auth.currentUser.uid);

  getCollection = () => this.getDocumentUser().collection(this.collectionName);

  getPaymentMethods = () => this.getCollection().snapshotChanges().pipe(map((actions: DocumentChangeAction<Payment>[]) =>
    actions.map((action: DocumentChangeAction<Payment>) => action.payload.doc.data())
  ))

  save = (payment: Payment) => this.getCollection().doc(payment.id).set({...payment});

}
