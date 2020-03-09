import * as firebase from 'firebase';
import {Grade} from './grade.class';
import {ActivityStatus} from './activity-status.enum';
import Timestamp = firebase.firestore.Timestamp;

export class Activity {
  uid?: string;
  name?: string;
  position: number;
  grades: Grade[];
  dueDate: Date | Timestamp;
  creationDate: Date | Timestamp;
  status: ActivityStatus;

  constructor(name: string, dueDate: Date | Timestamp) {
    this.name = name;
    this.dueDate = dueDate;
    this.creationDate = new Date();
    this.grades = [];
    this.status = ActivityStatus.CREATED;
  }

}
