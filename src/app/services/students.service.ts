import {Injectable} from '@angular/core';
import {AngularFirestore, DocumentChangeAction} from '@angular/fire/firestore';
import {GroupsService} from './groups.service';
import {map} from 'rxjs/operators';
import {Student} from '../models/student.class';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  collectionName = 'students';
  students: Student[];

  constructor(private db: AngularFirestore,
              private authService: AuthService,
              private groupsService: GroupsService) { }

  getDocumentGroup = () =>
    this.db.collection('users').doc(this.authService.user.uid)
      .collection('groups').doc(this.groupsService.group.uid)

  getCollectionStudents = () => this.getDocumentGroup().collection(this.collectionName);

  findAllByGroupUid = () => this.getDocumentGroup()
    .collection(this.collectionName, ref => ref.orderBy('lastName')).snapshotChanges()
    .pipe(map((documents: DocumentChangeAction<Student>[]) => {
        let listNumber = 1;
        return documents.map((action: DocumentChangeAction<Student>) => {
          const student: Student = action.payload.doc.data();
          const uid: string = action.payload.doc.id;
          return { ...student, listNumber: listNumber++, uid};
        });
      }
    ))

  save = (student: Student) => this.getCollectionStudents().add({...student});

  update = (uid: string, student: Student) => this.getCollectionStudents().doc(uid).update({...student});

  delete = (uid: string) => this.getCollectionStudents().doc(uid).delete();

  filterStudents = (filterValue: string | number): Student[] => {
    if (typeof filterValue === 'string' && isNaN(Number(filterValue))) {
      const replacedValue = filterValue
        .replace(/[áÁ]/g, 'a')
        .replace(/[éÉ]/g, 'e')
        .replace(/[íÍ]/g, 'i')
        .replace(/[óÓ]/g, 'o')
        .replace(/[úÚ]/g, 'u').toString();
      return this.students
        .filter(student => replacedValue.split(' ').every(filter =>
          student.name.toLowerCase().indexOf(filter) >= 0 ||
          student.lastName.toLowerCase().indexOf(filter) >= 0));
    } else {
      return this.students.filter(student => student.listNumber === Number(filterValue));
    }
  }
}
