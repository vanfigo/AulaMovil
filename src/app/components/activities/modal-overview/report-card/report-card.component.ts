import {Component, Input} from '@angular/core';
import {Student} from '../../../../models/student.class';
import {Activity} from '../../../../models/activity.class';
import {ReportCard} from '../../../../models/report-card.class';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivitiesService} from '../../../../services/activities.service';
import {PickerController, ToastController} from '@ionic/angular';
import {Grade} from '../../../../models/grade.class';

@Component({
  selector: 'app-report-card',
  templateUrl: './report-card.component.html',
  styleUrls: ['./report-card.component.scss'],
})
export class ReportCardComponent {

  @Input() student: Student;
  @Input() activities: Activity[] = [];
  reportCardGroup: FormGroup;
  reportCards: ReportCard[] = [];
  average: number;

  constructor(private activitiesService: ActivitiesService,
              private pickerController: PickerController,
              private toastController: ToastController) {
    this.reportCardGroup = new FormGroup({});
  }

  generateReportCard = () => {
    this.reportCards = [];
    this.reportCardGroup = new FormGroup({});
    this.activities.forEach(activity => {
      if (this.student) {
        const grade = activity.grades.find(storedGrade => storedGrade.studentUid === this.student.uid);
        const score = grade ? grade.score : this.activitiesService.minScore;
        const reportCard = new ReportCard(this.student, activity, score);
        this.reportCardGroup.addControl(reportCard.activityUid, new FormControl(reportCard.score));
        this.reportCards.push(reportCard);
        this.calculateAverage();
      }
    });
  }

  calculateAverage = () => {
    this.average = Object.values(this.reportCardGroup.controls)
      .reduce((sum: number, control: FormControl) => sum + Number(control.value), 0) / this.activities.length;
  }

  showScorePicker = async (reportCard: ReportCard) => {
    const picker = await this.pickerController.create({
      columns: [{
        name: 'score',
        options: this.activitiesService.options
      }],
      buttons: [{
        text: 'Cancelar',
        role: 'cancel'
      }, {
        text: 'Seleccionar',
        handler: (value) => {
          const score: number = value.score.value;
          this.reportCardGroup.get(reportCard.activityUid).setValue(score);
          const activity = this.activities.find(storedActivity => storedActivity.uid === reportCard.activityUid);
          if (activity.grades.find(storedGrade => storedGrade.studentUid === this.student.uid)) {
            activity.grades = activity.grades.map(storedGrade => {
              if (storedGrade.studentUid === this.student.uid) {
                storedGrade.score = score;
              }
              return storedGrade;
            });
          } else {
            activity.grades.push({...new Grade(this.student.uid, score)});
          }
          this.activitiesService.update(activity)
            .then(() => {
              this.calculateAverage();
              this.toastController.create({
                message: 'La calificacion ha sido guardada exitosamente',
                duration: 3000
              }).then(toast => toast.present());
            });
        }
      }]
    });
    await picker.present();
  }

}
