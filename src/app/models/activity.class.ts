import * as firebase from 'firebase';
import {Student} from './student.class';
import Timestamp = firebase.firestore.Timestamp;

export class Activity {
  uid?: string;
  name?: string;
  position: number;
  minScore: number;
  students: Student[];
  dueDate: Date | Timestamp;
  creationDate: Date | Timestamp;

  constructor(name: string, dueDate: Date, minScore: number) {
    this.name = name;
    this.dueDate = dueDate;
    this.minScore = minScore;
    this.creationDate = new Date();
    this.students = [];
  }

}
