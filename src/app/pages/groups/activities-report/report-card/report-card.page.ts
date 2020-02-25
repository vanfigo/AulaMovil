import {Component} from '@angular/core';
import {Student} from '../../../../models/student.class';
import {Activity} from '../../../../models/activity.class';
import {ReportCard} from '../../../../models/report-card.class';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivitiesService} from '../../../../services/activities.service';
import {PickerController, ToastController} from '@ionic/angular';
import {Grade} from '../../../../models/grade.class';
import {Router} from '@angular/router';

@Component({
  selector: 'app-report-card',
  templateUrl: './report-card.page.html',
  styleUrls: ['./report-card.page.scss'],
})
export class ReportCardPage {

  student: Student;
  activities: Activity[] = [];
  reportCardGroup: FormGroup;
  reportCards: ReportCard[] = [];
  average: number;

  constructor(private activitiesService: ActivitiesService,
              private pickerController: PickerController,
              private router: Router,
              private toastController: ToastController) {
    this.reportCardGroup = new FormGroup({});
    if (router.getCurrentNavigation() && router.getCurrentNavigation().extras) {
      this.activities = router.getCurrentNavigation().extras.state.activities;
      this.student = router.getCurrentNavigation().extras.state.student;
      this.generateReportCard();
    }
  }

  generateReportCard = () => {
    this.reportCards = [];
    this.reportCardGroup.controls = {};
    this.activities.forEach(activity => {
      const grade = activity.grades.find(storedGrade => storedGrade.studentUid === this.student.uid);
      const score = grade ? grade.score : this.activitiesService.minScore;
      const reportCard = new ReportCard(this.student, activity, score);
      this.reportCardGroup.addControl(reportCard.activityUid, new FormControl(reportCard.score));
      this.reportCards.push(reportCard);
      this.calculateAverage();
    });
  }

  calculateAverage = () => {
    this.average = Object.values(this.reportCardGroup.controls)
      .reduce((sum: number, control: FormControl) => sum + Number(control.value), 0) / this.activities.length;
  }

  showScorePicker = async (reportCard: ReportCard) => {
    this.pickerController.create({
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
    }).then(picker => picker.present());
  }

}
