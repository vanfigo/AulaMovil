import {Component, OnInit, ViewChild} from '@angular/core';
import {IonSegment, PickerController, ToastController} from '@ionic/angular';
import {ActivitiesService} from '../../../../services/activities.service';
import {ReportCard} from '../../../../models/report-card.class';
import {Student} from '../../../../models/student.class';
import {Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {Activity} from '../../../../models/activity.class';
import {Grade} from '../../../../models/grade.class';

@Component({
  selector: 'app-pending-activities',
  templateUrl: './pending-activities.page.html',
  styleUrls: ['./pending-activities.page.scss'],
})
export class PendingActivitiesPage implements OnInit {

  @ViewChild(IonSegment, {static: true}) activitiesSegment: IonSegment;
  loading: true;
  reportCards: ReportCard[] = [];
  pendingActivitiesGroup: FormGroup;
  student: Student;
  activities: Activity[];
  category: string;

  constructor(private activitiesService: ActivitiesService,
              private router: Router,
              private pickerController: PickerController,
              private toastController: ToastController) {
    this.pendingActivitiesGroup = new FormGroup({});
    if (router.getCurrentNavigation() && router.getCurrentNavigation().extras) {
      this.student = router.getCurrentNavigation().extras.state.student;
      this.generateReportCards();
    }
  }

  ngOnInit() {
    this.activitiesSegment.value = 'pending';
    this.category = this.activitiesSegment.value;
  }

  generateReportCards = () => {
    this.activitiesService.findAllByGroupUid().subscribe((activities: Activity[]) => {
      this.activities = activities;
      this.activitiesService.activities = activities;
      this.reportCards = [];
      this.pendingActivitiesGroup.controls = {};
      this.activities.forEach(activity => {
        const grade = activity.grades.find(storedGrade => storedGrade.studentUid === this.student.uid);
        const score = grade ? grade.score : null;
        const reportCard = new ReportCard(this.student, activity, score);
        this.pendingActivitiesGroup.addControl(reportCard.activityUid, new FormControl(reportCard.score));
        this.reportCards.push(reportCard);
      });
    });
  }

  showActivities = (event: CustomEvent) => {
    this.category = this.activitiesSegment.value;
  }

  filterActivities = (event: CustomEvent) => {
    const filterValue: string = event.detail.value.toLowerCase();
    if (filterValue.length > 0) {
      this.activities = this.activitiesService.filterActivities(filterValue);
    } else {
      this.activities = [...this.activitiesService.activities];
    }
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
          this.pendingActivitiesGroup.get(reportCard.activityUid).setValue(score);
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
            .then(() => this.toastController.create({
                message: 'La calificacion ha sido guardada exitosamente',
                duration: 3000
              }).then(toast => toast.present())
            );
        }
      }]
    }).then(picker => picker.present());
  }

}
