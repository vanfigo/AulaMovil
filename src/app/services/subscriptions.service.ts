import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from './auth.service';
import {AulaMovilSubscription} from '../models/aula-movil-subscription.class';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {

  collectionName = 'subscriptions';
  hasActiveSubscription: boolean;

  constructor(private db: AngularFirestore,
              private authService: AuthService) { }

  getDocumentUser = () => this.db.collection('users').doc(this.authService.user.uid);

  getCollection = () => this.getDocumentUser().collection(this.collectionName);

  getActive = () => this.getDocumentUser()
    .collection(this.collectionName, ref =>
      ref.where('status', 'in', ['active', 'past_due', 'trialing', 'incomplete']).limit(1))
    .valueChanges().pipe(map((snapshot) => snapshot.pop()))

  save = (subscription: AulaMovilSubscription) => this.getCollection().add({...subscription});

  update = (subscription: AulaMovilSubscription) => this.getCollection().doc(subscription.uid).update({...subscription});

}
