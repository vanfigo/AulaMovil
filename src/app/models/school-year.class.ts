import * as moment from 'moment';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export class SchoolYear {
  uid?: string;
  name: string;
  creationDate: Date | Timestamp;

  constructor(start: Date) {
    const startYear = moment(start).format('YYYY');
    const endYear = moment(start).add(1, 'years').format('YYYY');
    this.uid = `${startYear}${endYear}`;
    this.name = `${startYear}-${endYear}`;
    this.creationDate = new Date();
  }

}
