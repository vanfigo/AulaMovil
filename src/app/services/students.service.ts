import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentChangeAction} from '@angular/fire/firestore';
import {AuthService} from './auth.service';
import {GroupsService} from './groups.service';
import {SchoolYearsService} from './school-years.service';
import {map} from 'rxjs/operators';
import {Student} from '../models/student.class';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  collectionName = 'students';
  collectionGroups: AngularFirestoreCollection;

  constructor(private db: AngularFirestore,
              private authService: AuthService,
              private schoolYearsService: SchoolYearsService,
              private groupsService: GroupsService) {
    this.collectionGroups = db.collection('users').doc(authService.user.uid)
      .collection('schoolYears').doc(schoolYearsService.schoolYearUid)
      .collection('groups');
  }

  findAllByGroupUid = (groupUid: string) => this.collectionGroups.doc(groupUid)
    .collection(this.collectionName).snapshotChanges()
    .pipe(map((documents: DocumentChangeAction<Student>[]) =>
      documents.map((action: DocumentChangeAction<Student>) => {
        const student: Student = action.payload.doc.data();
        const uid: string = action.payload.doc.id;
        return { ...student, uid};
      })
    ))

  save = (student: Student) => this.collectionGroups.doc(this.groupsService.group.uid)
    .collection(this.collectionName).add({...student})

  update = (uid: string, student: Student) => this.collectionGroups.doc(this.groupsService.group.uid)
    .collection(this.collectionName).doc(uid).set({...student})

  delete = (uid: string) => this.collectionGroups.doc(this.groupsService.group.uid)
    .collection(this.collectionName).doc(uid).delete()

}
