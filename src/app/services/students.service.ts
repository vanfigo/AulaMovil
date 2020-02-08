import {Injectable} from '@angular/core';
import {AngularFirestore, DocumentChangeAction} from '@angular/fire/firestore';
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
  students: Student[];

  constructor(private db: AngularFirestore,
              private authService: AuthService,
              private schoolYearsService: SchoolYearsService,
              private groupsService: GroupsService) { }

  getCollectionGroups = () =>
    this.db.collection('users').doc(this.authService.user.uid)
      .collection('schoolYears').doc(this.schoolYearsService.schoolYearUid)
      .collection('groups')

  findAllByGroupUid = (groupUid: string) => this.getCollectionGroups().doc(groupUid)
    .collection(this.collectionName, ref => ref.orderBy('name')).snapshotChanges()
    .pipe(map((documents: DocumentChangeAction<Student>[]) =>
      documents.map((action: DocumentChangeAction<Student>) => {
        const student: Student = action.payload.doc.data();
        const uid: string = action.payload.doc.id;
        return { ...student, uid};
      })
    ))

  save = (student: Student) => this.getCollectionGroups().doc(this.groupsService.group.uid)
    .collection(this.collectionName).add({...student})

  update = (uid: string, student: Student) => this.getCollectionGroups().doc(this.groupsService.group.uid)
    .collection(this.collectionName).doc(uid).set({...student})

  delete = (uid: string) => this.getCollectionGroups().doc(this.groupsService.group.uid)
    .collection(this.collectionName).doc(uid).delete()

  filterStudents = (filterValue: string) => this.students
    .filter(student => filterValue.split(' ').every(filter =>
      student.name.toLowerCase().indexOf(filter) >= 0 ||
      student.lastName.toLowerCase().indexOf(filter) >= 0))
}
