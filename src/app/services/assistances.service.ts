import {Injectable} from '@angular/core';
import {AngularFirestore, QueryDocumentSnapshot, QuerySnapshot} from '@angular/fire/firestore';
import {Student} from '../models/student.class';
import {AuthService} from './auth.service';
import {GroupsService} from './groups.service';
import {Assistance} from '../models/assistance.class';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssistancesService {

  collectionName = 'assistance';
  uidFormat = 'YYYYMMDD';
  students: Student[];

  constructor(private db: AngularFirestore,
              private authService: AuthService,
              private groupsService: GroupsService) { }

  getDocumentGroup = () => this.db.collection('users').doc(this.authService.user.uid)
    .collection('groups').doc(this.groupsService.group.uid)

  findByUid = (uid: string) => this.getDocumentGroup().collection(this.collectionName).doc(uid).get();

  findByDateRange = (initialUidDate: string, finalUidDate: string) => this.getDocumentGroup()
    .collection(this.collectionName, ref =>
      ref.where('uid', '>=', initialUidDate).where('uid', '<=', finalUidDate).orderBy('uid')).get()
    .pipe(map((snapshot: QuerySnapshot<Assistance>) => snapshot.docs.map((document: QueryDocumentSnapshot<Assistance>) => {
      const assistance = document.data();
      return {...assistance};
    })))

  findInDatesArray = (dates: string[]) => this.getDocumentGroup()
    .collection(this.collectionName, ref => ref.where('uid', 'in', dates))
    .get().pipe(map((snapshot: QuerySnapshot<Assistance>) => snapshot.docs.map((document: QueryDocumentSnapshot<Assistance>) => {
      const assistance = document.data();
      return {...assistance};
    })))

  save = (assistance: Assistance) => this.getDocumentGroup() .collection(this.collectionName)
    .doc(assistance.uid).set({...assistance})

}
