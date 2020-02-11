import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export class Group {
  uid?: string;
  name: string;
  students: number;
  schoolYear: string;
  creationDate: Date | Timestamp;

  constructor(name: string, schoolYear: string) {
    this.name = name.toUpperCase();
    this.schoolYear = schoolYear;
    this.creationDate = new Date();
    this.students = 0;
    this.uid = null;
  }

}
