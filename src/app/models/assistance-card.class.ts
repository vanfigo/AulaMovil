import * as moment from 'moment';

export class AssistanceCard {
  studentUid: string;
  assistanceUid: string;
  date: Date;
  notAssisted: boolean;

  constructor(studentUid: string, date: Date, notAssisted: boolean) {
    this.studentUid = studentUid;
    this.date = date;
    this.assistanceUid = moment(date).format('YYYYMMDD');
    this.notAssisted = notAssisted;
  }

}
