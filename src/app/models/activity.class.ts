import * as firebase from 'firebase';
import {Grade} from './grade.class';
import Timestamp = firebase.firestore.Timestamp;

export class Activity {
  uid?: string;
  name?: string;
  position: number;
  grades: Grade[];
  dueDate: Date | Timestamp;
  creationDate: Date | Timestamp;
  isSaved: boolean;

  constructor(name: string, dueDate: Date | Timestamp) {
    this.name = name;
    this.dueDate = dueDate;
    this.creationDate = new Date();
    this.grades = [];
    this.isSaved = false;
  }

}
