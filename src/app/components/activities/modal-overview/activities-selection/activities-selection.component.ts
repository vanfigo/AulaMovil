import {AfterViewInit, Component, EventEmitter, OnDestroy, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Activity} from '../../../../models/activity.class';
import {IonCheckbox, IonDatetime} from '@ionic/angular';
import {ActivitiesService} from '../../../../services/activities.service';
import {Subscription} from 'rxjs';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

@Component({
  selector: 'app-activities-selection',
  templateUrl: './activities-selection.component.html',
  styleUrls: ['./activities-selection.component.scss'],
})
export class ActivitiesSelectionComponent implements AfterViewInit, OnDestroy {

  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  initialTimestamp: Timestamp;
  finalTimestamp: Timestamp;
  activities: Activity[] = [];
  filteredActivities: Activity[] = [];
  selectedActivities: Activity[] = [];
  loading = false;
  @ViewChild('finalDate', { static: true }) finalIonDatetime: IonDatetime;
  @ViewChild('noDueDateCheckbox', { static: true }) noDueDateCheckbox: IonCheckbox;
  @ViewChildren(IonCheckbox) activitiesCheckbox: QueryList<IonCheckbox>;
  @Output() selectedActivitiesEvent = new EventEmitter<Activity[]>();
  activityCheckBoxSub = new Subscription();

  constructor(private activitiesService: ActivitiesService) { }

  ngAfterViewInit() {
    this.activityCheckBoxSub = this.activitiesCheckbox.changes.subscribe(this.updateSelectedCheckBox);
  }

  ngOnDestroy() {
    this.activityCheckBoxSub.unsubscribe();
  }

  updateSelectedCheckBox = () => this.activitiesCheckbox.forEach((checkBox: IonCheckbox) => {
    if (this.selectedActivities.find((activity: Activity) => checkBox.name === activity.uid)) {
      checkBox.checked = true;
    }
  })

  setInitialDate = (event: CustomEvent) => {
    this.finalIonDatetime.value = null;
    this.findActivities();
    const initialDate = new Date(event.detail.value);
    this.initialTimestamp = firebase.firestore.Timestamp.fromDate(
      new Date(initialDate.getFullYear(), initialDate.getMonth(), initialDate.getDate()));
  }

  setFinalDate = (event: CustomEvent) => {
    if (event.detail.value !== null) {
      const finalDate = new Date(event.detail.value);
      this.finalTimestamp = firebase.firestore.Timestamp.fromDate(
        new Date(finalDate.getFullYear(), finalDate.getMonth(), finalDate.getDate()));
      this.findActivities();
    } else {
      this.finalTimestamp = null;
    }
  }

  findActivities = () => {
    this.loading = true;
    if (this.finalTimestamp && this.noDueDateCheckbox.checked) {
      this.activitiesService.findAllByNoDueDateAndDueDates(this.initialTimestamp, this.finalTimestamp)
        .subscribe(activities => {
          this.activities = activities;
          this.filteredActivities = activities;
          this.updateSelectedActivities();
          this.loading = false;
        });
    } else if (this.finalTimestamp) {
      this.activitiesService.findAllByDueDates(this.initialTimestamp, this.finalTimestamp)
        .subscribe(activities => {
          this.activities = activities;
          this.filteredActivities = activities;
          this.updateSelectedActivities();
          this.loading = false;
        });
    } else if (this.noDueDateCheckbox.checked) {
      this.activitiesService.findAllWithoutDueDate()
        .subscribe(activities => {
          this.activities = activities;
          this.filteredActivities = activities;
          this.updateSelectedActivities();
          this.loading = false;
        });
    } else {
      this.activities = [];
      this.updateSelectedActivities();
      this.loading = false;
    }
  }

  updateSelectedActivities = () => {
    this.selectedActivities = this.selectedActivities
      .filter(selectedActivity => this.activities.find(activity => activity.uid === selectedActivity.uid));
    this.selectedActivitiesEvent.emit(this.selectedActivities);
  }

  selectActivity = (event: CustomEvent, activity: Activity) => {
    if (event.detail.checked) {
      if (!this.selectedActivities.find(selectedActivity => selectedActivity.uid === activity.uid)) {
        this.selectedActivities.push(activity);
      }
    } else {
      this.selectedActivities = this.selectedActivities.filter(storedActivity => storedActivity.uid !== activity.uid);
    }
    this.selectedActivitiesEvent.emit(this.selectedActivities);
  }

  filterActivities = (event: CustomEvent) => {
    const filterValue: string = event.detail.value.toLowerCase();
    if (filterValue.length > 0) {
      if (typeof filterValue === 'string' && isNaN(Number(filterValue))) {
        this.activities = this.filteredActivities.filter(activity => filterValue.split(' ').every(filter =>
            activity.name.toLowerCase().indexOf(filter) >= 0 ));
      } else {
        this.activities = this.filteredActivities.filter(activity => activity.position === Number(filterValue));
      }
    } else {
      this.activities = [...this.filteredActivities];
    }
  }

}
