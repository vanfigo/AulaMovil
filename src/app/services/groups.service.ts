import {Injectable} from '@angular/core';
import {
  AngularFirestore,
  DocumentChangeAction,
  DocumentReference,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  QuerySnapshot
} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {Group} from '../models/group.class';
import {Assistance} from '../models/assistance.class';
import {Activity} from '../models/activity.class';
import {Student} from '../models/student.class';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  group: Group;
  collectionName = 'groups';
  studentsCollectionName = 'students';
  activitiesCollectionName = 'activities';

  constructor(private db: AngularFirestore,
              private authService: AuthService) {
  }

  getDocumentUser = () => this.db.collection('users').doc(this.authService.user.uid);

  getCollectionGroup = () => this.db.collection('users').doc(this.authService.user.uid).collection(this.collectionName);

  findAll = () => this.getDocumentUser().collection(this.collectionName, ref => ref.orderBy('schoolYear').orderBy('name'))
    .get().pipe(map((snapshot: QuerySnapshot<Group>) =>
      snapshot.docs.map((document: QueryDocumentSnapshot<Group>) => {
        const group: Group = document.data();
        const uid: string = document.id;
        return { ...group, uid};
      })
    ))

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

  update = (group: Group) => this.getCollectionGroup().doc(group.uid).update({...group});

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

  transferStudents = (originUid: string, destinyUid: string) =>
    this.getCollectionGroup().doc(originUid).collection(this.studentsCollectionName)
      .get().pipe(map((snapshot: QuerySnapshot<Student>): Student[] =>
      snapshot.docs.map((document: QueryDocumentSnapshot<Student>) => {
        const student = document.data();
        return {...student, creationDate: new Date()};
      }))).toPromise().then((students: Student[]) => students.forEach(student =>
      this.getCollectionGroup().doc(destinyUid).collection(this.studentsCollectionName).add({...student})))

  transferActivities = (originUid: string, destinyUid: string) =>
    this.getCollectionGroup().doc(originUid).collection(this.activitiesCollectionName)
      .get().pipe(map((snapshot: QuerySnapshot<Activity>): Activity[] =>
      snapshot.docs.map((document: QueryDocumentSnapshot<Activity>) => {
        const activity = document.data();
        return {...activity, creationDate: new Date(), grades: [], status: 0};
      }))).toPromise().then((activities: Activity[]) => activities.forEach(activity =>
      this.getCollectionGroup().doc(destinyUid).collection(this.activitiesCollectionName).add({...activity})))

}
