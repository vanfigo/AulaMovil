import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Activity} from '../../../../models/activity.class';
import {IonDatetime} from '@ionic/angular';
import {ActivitiesService} from '../../../../services/activities.service';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

@Component({
  selector: 'app-activities-selection',
  templateUrl: './activities-selection.component.html',
  styleUrls: ['./activities-selection.component.scss'],
})
export class ActivitiesSelectionComponent implements OnInit {

  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  initialTimestamp: Timestamp;
  finalTimestamp: Timestamp;
  activities: Activity[];
  activitiesNoDueDate: Activity[];
  selectedActivities: Activity[] = [];
  @ViewChild('finalDate', { static: true }) finalIonDatetime: IonDatetime;
  @Output() selectedActivitiesEvent = new EventEmitter<Activity[]>();

  constructor(private activitiesService: ActivitiesService) { }

  ngOnInit() {
    this.activitiesService.findAllWithoutDueDate()
      .subscribe((activities: Activity[]) => {
        this.activitiesNoDueDate = activities;
      });
  }

  setInitialDate = (event: CustomEvent) => {
    this.finalIonDatetime.value = null;
    this.activities = [];
    const initialDate = new Date(event.detail.value);
    this.initialTimestamp = firebase.firestore.Timestamp.fromDate(
      new Date(initialDate.getFullYear(), initialDate.getMonth(), initialDate.getDate()));
  }

  setFinalDate = (event: CustomEvent) => {
    if (event.detail.value !== null) {
      const finalDate = new Date(event.detail.value);
      this.finalTimestamp = firebase.firestore.Timestamp.fromDate(
        new Date(finalDate.getFullYear(), finalDate.getMonth(), finalDate.getDate()));
      this.activitiesService.findAllByDueDates(this.initialTimestamp, this.finalTimestamp)
        .subscribe((activities: Activity[]) => {
          this.activities = activities;
          this.selectedActivities = this.selectedActivities.filter(activity => activity.dueDate === null);
          this.selectedActivities.push(...activities);
          this.selectedActivitiesEvent.emit(this.selectedActivities);
        });
    }
  }

  selectActivity = (event: CustomEvent, activity: Activity) => {
    if (event.detail.checked) {
      this.selectedActivities.push(activity);
    } else {
      this.selectedActivities = this.selectedActivities.filter(storedActivity => storedActivity.uid !== activity.uid);
    }
    this.selectedActivitiesEvent.emit(this.selectedActivities);
  }

}
