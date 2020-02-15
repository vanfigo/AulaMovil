import {Student} from './student.class';
import {Activity} from './activity.class';

export class ReportCard {
  studentUid: string;
  activityUid: string;
  position: number;
  name: string;
  score: number;

  constructor(student: Student, activity: Activity, score: number) {
    this.studentUid = student.uid;
    this.activityUid = activity.uid;
    this.name = activity.name;
    this.position = activity.position;
    this.score = score;
  }
}
