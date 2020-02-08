import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export class Student {
  uid?: string;
  name: string;
  lastName: string;
  creationDate: Date | Timestamp;

  constructor(name: string, lastName: string) {
    this.name = name.split(' ')
      .map(subName => subName.charAt(0).toUpperCase() + subName.substring(1)).join(' ');
    this.lastName = lastName.split(' ')
      .map(subName => subName.charAt(0).toUpperCase() + subName.substring(1)).join(' ');
    this.uid = null;
    this.creationDate = new Date();
  }

}
