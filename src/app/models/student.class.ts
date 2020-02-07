import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export class Student {
  uid?: string;
  name: string;
  lastName: string;
  creationDate: Date | Timestamp;

  constructor(name: string, lastName: string) {
    this.name = name;
    this.lastName = lastName;
    this.uid = null;
    this.creationDate = new Date();
  }

}
