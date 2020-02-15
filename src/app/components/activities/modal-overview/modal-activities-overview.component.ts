import {Component, OnInit, ViewChild} from '@angular/core';
import {Activity} from '../../../models/activity.class';
import {IonSlides, ModalController, ToastController} from '@ionic/angular';
import {Student} from '../../../models/student.class';
import {ReportCardComponent} from './report-card/report-card.component';

@Component({
  selector: 'app-modal-activities-overview',
  templateUrl: './modal-activities-overview.component.html',
  styleUrls: ['./modal-activities-overview.component.scss'],
})
export class ModalActivitiesOverviewComponent implements OnInit {

  slideOpts = {
    slidesPerView: 1,
    autoPlay: false,
  };
  @ViewChild(IonSlides, {static: true}) slides: IonSlides;
  @ViewChild(ReportCardComponent, {static: true}) reportCard: ReportCardComponent;
  activities: Activity[] = [];
  student: Student;

  constructor(public modalController: ModalController,
              private toastController: ToastController) { }

  ngOnInit() {
    this.slides.ionSlideDidChange.subscribe(async (slide)  => {
      const index = await this.slides.getActiveIndex();
      if (index === 2) {
        this.reportCard.generateReportCard();
      }
    });
  }

  activitiesSelected = async (activities: Activity[]) => {
    this.activities = activities;
    await this.slides.lockSwipes(false);
  }

  studentSelected = async (student: Student) => {
    this.student = student;
    await this.slides.slideNext();
  }

}
