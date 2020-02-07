import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentChangeAction, DocumentSnapshot} from '@angular/fire/firestore';
import {AuthService} from './auth.service';
import {map} from 'rxjs/operators';
import {Group} from '../models/group.class';
import {SchoolYearsService} from './school-years.service';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  group: Group;
  collectionName = 'groups';
  collectionSchoolYears: AngularFirestoreCollection;

  constructor(private db: AngularFirestore,
              private authService: AuthService,
              private schoolYearsService: SchoolYearsService) {
    this.collectionSchoolYears = db.collection('users').doc(authService.user.uid)
      .collection('schoolYears');
  }

  findByUid = (groupUid: string) => this.collectionSchoolYears.doc(this.schoolYearsService.schoolYearUid)
    .collection(this.collectionName).doc(groupUid).get().pipe(map((document: DocumentSnapshot<Group>) => {
      const group: Group = document.data();
      const uid: string = document.id;
      return { ...group, uid};
    }))
  
  findAllBySchoolYearUid = () => this.collectionSchoolYears.doc(this.schoolYearsService.schoolYearUid)
    .collection(this.collectionName, ref => ref.orderBy('name')).snapshotChanges().pipe(map((documents: DocumentChangeAction<Group>[]) =>
      documents.map((action: DocumentChangeAction<Group>) => {
        const group: Group = action.payload.doc.data();
        const uid: string = action.payload.doc.id;
        return { ...group, uid};
      })
    ))

  save = (group: Group) => this.collectionSchoolYears.doc(this.schoolYearsService.schoolYearUid)
    .collection(this.collectionName).add({...group})
  
}
