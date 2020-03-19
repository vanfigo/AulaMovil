import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export class Group {
  uid?: string;
  backgroundCover?: string;
  name: string;
  students: number;
  activities: number;
  schoolYear: string;
  creationDate: Date | Timestamp;

  constructor(name: string, schoolYear: string) {
    this.name = name.toUpperCase();
    this.backgroundCover = `assets/groupCovers/${Math.floor((Math.random() * 40) + 1)}.jpg`;
    this.schoolYear = schoolYear;
    this.creationDate = new Date();
    this.students = 0;
    this.activities = 0;
    this.uid = null;
  }

}
