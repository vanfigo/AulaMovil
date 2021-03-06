import {Component, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {IonCheckbox, IonDatetime, LoadingController, NavController, ToastController} from '@ionic/angular';
import {Subscription} from 'rxjs';
import * as firebase from 'firebase';
import {Activity} from '../../../../models/activity.class';
import {ActivitiesService} from '../../../../services/activities.service';
import {ActivatedRoute} from '@angular/router';
import {GroupsService} from '../../../../services/groups.service';
import Timestamp = firebase.firestore.Timestamp;

@Component({
  selector: 'app-activities-selection',
  templateUrl: './activities-selection.page.html',
  styleUrls: ['./activities-selection.page.scss'],
})
export class ActivitiesSelectionPage implements OnInit {

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

  constructor(private activitiesService: ActivitiesService,
              private groupsService: GroupsService,
              private navController: NavController,
              private loadingController: LoadingController,
              private activatedRoute: ActivatedRoute,
              private toastController: ToastController) { }

  async ngOnInit() {
    const loadingPop = await this.loadingController.create({ message: 'Cargando...' });
    await loadingPop.present();
    this.groupsService.findByUid(this.activatedRoute.snapshot.params.groupUid).toPromise().then(group => {
      this.groupsService.group = group;
      loadingPop.dismiss();
    });
  }

  ionViewWillEnter() {
    this.activityCheckBoxSub = this.activitiesCheckbox.changes.subscribe(this.updateSelectedCheckBox);
  }

  ionViewWillLeave() {
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

  showSelectStudents = () => {
    if (this.selectedActivities.length > 0) {
      this.navController.navigateForward(['../students'], {
        relativeTo: this.activatedRoute,
        state: {
          activities: this.selectedActivities
        }
      });
    } else {
      this.toastController.create({
        message: 'Selecciona al menos una actividad',
        duration: 3000
      }).then(toast => toast.present());
    }
  }

  selectAllActivities = (event: CustomEvent) => this.activitiesCheckbox .forEach(checkbox => {
      if (checkbox.name !== 'noDueDate') {
        checkbox.checked = event.detail.checked;
      }
    })

}
