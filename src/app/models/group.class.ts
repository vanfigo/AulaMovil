import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export class Group {
  uid?: string;
  name: string;
  students: number;
  creationDate: Date | Timestamp;

  constructor(name: string) {
    this.name = name.toUpperCase();
    this.creationDate = new Date();
    this.students = 0;
    this.uid = null;
  }

}
