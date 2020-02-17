import {Injectable} from '@angular/core';
import {
  AngularFirestore,
  DocumentChangeAction,
  DocumentReference,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  QuerySnapshot
} from '@angular/fire/firestore';
import {AuthService} from './auth.service';
import {map} from 'rxjs/operators';
import {Group} from '../models/group.class';
import {Assistance} from '../models/assistance.class';
import {Activity} from '../models/activity.class';
import {Student} from '../models/student.class';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  group: Group;
  collectionName = 'groups';

  constructor(private db: AngularFirestore,
              private authService: AuthService) {
  }

  getDocumentUser = () => this.db.collection('users').doc(this.authService.user.uid);

  getCollectionGroup = () => this.db.collection('users').doc(this.authService.user.uid).collection(this.collectionName);

  findByUid = (groupUid: string) => this.getCollectionGroup().doc(groupUid)
    .get().pipe(map((document: DocumentSnapshot<Group>) => {
      const group: Group = document.data();
      const uid: string = document.id;
      return { ...group, uid};
    }))

  findAllBySchoolYearUid = (schoolYearUid: string) => this.getDocumentUser().collection(this.collectionName, ref =>
    ref.orderBy('name').where('schoolYear', '==', schoolYearUid))
    .snapshotChanges().pipe(map((documents: DocumentChangeAction<Group>[]) =>
      documents.map((action: DocumentChangeAction<Group>) => {
        const group: Group = action.payload.doc.data();
        const uid: string = action.payload.doc.id;
        return { ...group, uid};
      })
    ))

  save = (group: Group) => this.getCollectionGroup().add({...group});

  update = (group: Group) => this.getCollectionGroup().doc(group.uid).set({...group});

  delete = async (groupUid: string) => {
    const batch = this.db.firestore.batch();
    // delete assistance
    const assistances: DocumentReference[] = await this.db.collection('users').doc(this.authService.user.uid)
      .collection('groups').doc(groupUid)
      .collection('assistance').get().pipe(map((snapshot: QuerySnapshot<Assistance>) =>
        snapshot.docs.map((document: QueryDocumentSnapshot<Assistance>) => document.ref)
      )).toPromise();
    assistances.forEach(assistance => batch.delete(assistance));
    // delete activities
    const activities: DocumentReference[] = await this.db.collection('users').doc(this.authService.user.uid)
      .collection('groups').doc(groupUid)
      .collection('activities').get().pipe(map((snapshot: QuerySnapshot<Activity>) =>
        snapshot.docs.map((document: QueryDocumentSnapshot<Activity>) => document.ref)
      )).toPromise();
    activities.forEach(activity => batch.delete(activity));
    // delete students
    const students: DocumentReference[] = await this.db.collection('users').doc(this.authService.user.uid)
      .collection('groups').doc(groupUid)
      .collection('students').get().pipe(map((snapshot: QuerySnapshot<Student>) =>
        snapshot.docs.map((document: QueryDocumentSnapshot<Student>) => document.ref)
      )).toPromise();
    students.forEach(student => batch.delete(student));
    batch.delete(this.getCollectionGroup().doc(groupUid).ref);
    await batch.commit();
  }

}
