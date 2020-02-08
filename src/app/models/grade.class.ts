import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export class Grade {
  uid?: string;
  studentUid: string;
  score: number;
  creationDate: Date | Timestamp;

  constructor(studentUid: string, score: number) {
    this.studentUid = studentUid;
    this.score = score;
    this.creationDate = new Date();
  }

}
