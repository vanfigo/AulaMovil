import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentChangeAction} from '@angular/fire/firestore';
import {AuthService} from './auth.service';
import {map} from 'rxjs/operators';
import {SchoolYear} from '../models/school-year.class';

@Injectable({
  providedIn: 'root'
})
export class SchoolYearsService {

  schoolYearUid: string;
  collectionName = 'schoolYears';
  collectionUsers: AngularFirestoreCollection;

  constructor(private db: AngularFirestore,
              private authService: AuthService) {
    this.collectionUsers = db.collection('users');
  }

  findAll = () => this.collectionUsers.doc(this.authService.user.uid).collection(this.collectionName)
    .snapshotChanges().pipe(map((documents: DocumentChangeAction<SchoolYear>[]) =>
      documents.map((action: DocumentChangeAction<SchoolYear>) => {
        const schoolYear: SchoolYear = action.payload.doc.data();
        const uid: string = action.payload.doc.id;
        return { uid, ...schoolYear};
      })
    ))

  findByUid = (uid: string) => this.collectionUsers.doc(this.authService.user.uid)
    .collection(this.collectionName).doc<SchoolYear>(uid).get()

  save = (schoolYear: SchoolYear) => this.collectionUsers.doc(this.authService.user.uid)
    .collection(this.collectionName).doc(schoolYear.uid).set({...schoolYear})

  delete = (uid: string) => this.collectionUsers.doc(this.authService.user.uid)
    .collection(this.collectionName).doc(uid).delete()
}
