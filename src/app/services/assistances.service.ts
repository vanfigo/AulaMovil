import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Student} from '../models/student.class';
import {AuthService} from './auth.service';
import {SchoolYearsService} from './school-years.service';
import {GroupsService} from './groups.service';
import {Assistance} from '../models/assistance.class';

@Injectable({
  providedIn: 'root'
})
export class AssistancesService {

  collectionName = 'assistance';
  students: Student[];

  constructor(private db: AngularFirestore,
              private authService: AuthService,
              private schoolYearsService: SchoolYearsService,
              private groupsService: GroupsService) { }

  getCollectionGroups = () =>
    this.db.collection('users').doc(this.authService.user.uid)
      .collection('schoolYears').doc(this.schoolYearsService.schoolYearUid)
      .collection('groups')

  findByUid = (uid: string) => this.getCollectionGroups().doc(this.groupsService.group.uid)
    .collection(this.collectionName).doc(uid).get()

  save = (assistance: Assistance) => this.getCollectionGroups().doc(this.groupsService.group.uid)
    .collection(this.collectionName).doc(assistance.uid).set({...assistance})

}
