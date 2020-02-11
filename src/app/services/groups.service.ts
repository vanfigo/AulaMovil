import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument, DocumentChangeAction, DocumentSnapshot} from '@angular/fire/firestore';
import {AuthService} from './auth.service';
import {map} from 'rxjs/operators';
import {Group} from '../models/group.class';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  group: Group;
  collectionName = 'groups';
  userDocument: AngularFirestoreDocument;

  constructor(private db: AngularFirestore,
              private authService: AuthService) {
    this.userDocument = db.collection('users').doc(authService.user.uid);
  }

  findByUid = (groupUid: string) => this.userDocument.collection(this.collectionName).doc(groupUid)
    .get().pipe(map((document: DocumentSnapshot<Group>) => {
      const group: Group = document.data();
      const uid: string = document.id;
      return { ...group, uid};
    }))

  findAllBySchoolYearUid = (schoolYearUid: string) => this.userDocument.collection(this.collectionName, ref =>
    ref.orderBy('name').where('schoolYear', '==', schoolYearUid))
    .snapshotChanges().pipe(map((documents: DocumentChangeAction<Group>[]) =>
      documents.map((action: DocumentChangeAction<Group>) => {
        const group: Group = action.payload.doc.data();
        const uid: string = action.payload.doc.id;
        return { ...group, uid};
      })
    ))

  save = (group: Group) => this.userDocument.collection(this.collectionName).add({...group});

}
