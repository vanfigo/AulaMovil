import {Component, OnInit, ViewChild} from '@angular/core';
import {Activity} from '../../../models/activity.class';
import {IonSlides, ModalController, ToastController} from '@ionic/angular';
import {Student} from '../../../models/student.class';
import {ReportCard} from '../../../models/report-card.class';

@Component({
  selector: 'app-modal-activities-overview',
  templateUrl: './modal-activities-overview.component.html',
  styleUrls: ['./modal-activities-overview.component.scss'],
})
export class ModalActivitiesOverviewComponent implements OnInit {

  slideOpts = {
    slidesPerView: 1,
    autoPlay: false,
    slideShadows: true,
  };
  @ViewChild(IonSlides, {static: true}) slides: IonSlides;
  activities: Activity[] = [];
  student: Student;
  reportCards: ReportCard[];
  average: number;

  constructor(public modalController: ModalController,
              private toastController: ToastController) { }

  ngOnInit() {
    this.slides.ionSlideDidChange.subscribe(async (slide)  => {
      const index = await this.slides.getActiveIndex();
      if (index === 2) {
        if ( this.student || this.activities.length > 0 ) {
          this.generateReportCard();
        } else {
          this.toastController.create({
            message: 'Debes seleccionar al menos una actividad y a un estudiante',
            duration: 3000,
            color: 'danger'
          }).then(toast => toast.present());
        }
      }
    });
  }

  activitiesSelected = async (activities: Activity[]) => {
    this.activities = activities;
  }

  studentSelected = async (student: Student) => {
    this.student = student;
    await this.slides.slideNext();
    this.generateReportCard();
  }

  generateReportCard = () => {
    this.reportCards = [];
    let sum = 0;
    this.activities.forEach(activity => {
      if (this.student) {
        const grade = activity.grades.find(storedGrade => storedGrade.studentUid === this.student.uid);
        const score = grade ? grade.score : 5;
        const reportCard = new ReportCard(this.student, activity, score);
        this.reportCards.push(reportCard);
        sum += score;
      }
    });
    this.average = this.activities.length > 0 ? sum / this.activities.length : 0;
  }

  getActivitiesText = () => this.activities.length + (this.activities.length === 1 ? ' Actividad' : ' Actividades');

}
