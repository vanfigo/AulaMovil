import {Injectable} from '@angular/core';
import {AngularFirestore, DocumentChangeAction, QueryDocumentSnapshot, QuerySnapshot} from '@angular/fire/firestore';
import {AuthService} from './auth.service';
import {GroupsService} from './groups.service';
import {map} from 'rxjs/operators';
import {Activity} from '../models/activity.class';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  collectionName = 'activities';
  minScore = 5;
  maxScore = 10;

  constructor(private db: AngularFirestore,
              private authService: AuthService,
              private groupsService: GroupsService) { }

  getDocumentGroup = () => this.db.collection('users').doc(this.authService.user.uid)
      .collection('groups').doc(this.groupsService.group.uid)

  getCollectionActivities = () => this.getDocumentGroup().collection(this.collectionName);

  findAllByGroupUid = () => this.getDocumentGroup()
    .collection(this.collectionName, ref => ref.orderBy('position')).snapshotChanges()
    .pipe(map((documents: DocumentChangeAction<Activity>[]) =>
      documents.map((action: DocumentChangeAction<Activity>) => {
        const activity: Activity = action.payload.doc.data();
        const uid: string = action.payload.doc.id;
        if (activity.dueDate instanceof Timestamp) {
          activity.dueDate = activity.dueDate ? activity.dueDate.toDate() : null;
        }
        return { ...activity, uid};
      })
    ))

  findAllWithoutDueDate = () => this.getDocumentGroup()
    .collection(this.collectionName, ref => ref.orderBy('position').where('dueDate', '==', null))
    .snapshotChanges().pipe(map((documents: DocumentChangeAction<Activity>[]) =>
      documents.map((action: DocumentChangeAction<Activity>) => {
        const activity: Activity = action.payload.doc.data();
        const uid: string = action.payload.doc.id;
        return { ...activity, uid};
      })
    ))

  findAllByDueDates = (initialDate: Timestamp, finalDate: Timestamp) => this.getDocumentGroup()
    .collection(this.collectionName, ref =>
      ref.orderBy('dueDate').orderBy('position')
        .where('dueDate', '>=', initialDate).where('dueDate', '<=', finalDate))
    .snapshotChanges().pipe(map((documents: DocumentChangeAction<Activity>[]) =>
      documents.map((action: DocumentChangeAction<Activity>) => {
        const activity: Activity = action.payload.doc.data();
        const uid: string = action.payload.doc.id;
        return { ...activity, uid};
      })
    ))

  save = (activity: Activity) => this.getCollectionActivities().get().toPromise()
    .then((snapshot: QuerySnapshot<Activity>) =>
      this.getCollectionActivities().add({ ...activity, position: snapshot.size + 1 }))

  update = (activity: Activity) => this.getCollectionActivities().doc(activity.uid).set({...activity});

  delete = (activity: Activity) =>
    this.getDocumentGroup().collection(this.collectionName, ref => ref.where('position', '>', activity.position))
      .get().toPromise().then((snapshot: QuerySnapshot<Activity>) => {
        const batch = this.db.firestore.batch();
        batch.delete(this.getCollectionActivities().doc(activity.uid).ref);
        snapshot.docs.forEach((storedActivity: QueryDocumentSnapshot<Activity>) =>
          batch.update(storedActivity.ref, {position: storedActivity.data().position - 1}));
        return batch.commit();
      })

  changePosition = (fromUid: string, from: number, toUid: string, to: number) => {
    const batch = this.db.firestore.batch();
    const fromDocument = this.getCollectionActivities().doc(fromUid).ref;
    const increment = from > to ? 1 : -1;
    return this.getDocumentGroup().collection(this.collectionName, ref => ref
      .where('position', '>=', to).where('position', '<', from))
      .get().toPromise().then((snapshot: QuerySnapshot<Activity>) => {
      snapshot.docs.forEach((storedActivity: QueryDocumentSnapshot<Activity>) =>
        batch.update(storedActivity.ref, {position: storedActivity.data().position + increment}));
      batch.update(fromDocument, {position: to});
      return batch.commit();
    });
  }

}
