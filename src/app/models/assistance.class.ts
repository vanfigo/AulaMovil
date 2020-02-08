import {Student} from './student.class';
import * as moment from 'moment';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export class Assistance {
  uid?: string;
  students: Student[];
  date: Date | Timestamp;
  creationDate: Date | Timestamp;

  constructor(date: Date) {
    this.uid = moment(date).format('YYYYMMDD');
    this.date = date;
    this.creationDate = new Date();
    this.students = [];
  }

}
