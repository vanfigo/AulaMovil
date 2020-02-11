import {Component} from '@angular/core';
import {ActivitiesService} from '../../../services/activities.service';
import {GroupsService} from '../../../services/groups.service';
import {Activity} from '../../../models/activity.class';
import {AlertController, ModalController, ToastController} from '@ionic/angular';
import {ModalActivitiesComponent} from '../../../components/activities/modal-activities/modal-activities.component';
import {ModalActivityGradesComponent} from '../../../components/activities/modal-activity-grades/modal-activity-grades.component';
import {DeactivatableComponent} from '../../../interfaces/deactivable-component.interface';
import {Observable} from 'rxjs';
import {ModalActivitiesOverviewComponent} from '../../../components/activities/modal-activities-overview/modal-activities-overview.component';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.page.html',
  styleUrls: ['./activities.page.scss'],
})
export class ActivitiesPage implements DeactivatableComponent {

  loading = true;
  disableReorder = true;
  activities: Activity[];
  filteredActivities: Activity[];

  constructor(private activitiesService: ActivitiesService,
              private groupsService: GroupsService,
              private modalController: ModalController,
              private alertController: AlertController,
              private toastController: ToastController) {
    activitiesService.findAllByGroupUid().subscribe(activities => {
        this.activities = activities;
        this.filteredActivities = activities;
        this.loading = false;
      });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.modalController.getTop()
      .then((top: HTMLElement | undefined) => {
        if (top) {
          this.modalController.dismiss();
        }
        return top === undefined;
      });
  }

  showAddActivity = () => this.modalController.create({
    component: ModalActivitiesComponent
  }).then(modal => modal.present())

  showEditActivity = (activity: Activity) => this.modalController.create({
    component: ModalActivitiesComponent,
    componentProps: { activity }
  }).then(modal => modal.present())

  showDeleteActivity = (activity: Activity) => {
    this.alertController.create({
      header: 'Eliminar Actividad',
      subHeader: `¿Está seguro que desea eliminar la actividad?`,
      message: `Actividad ${activity.position}: ${activity.name}`,
      buttons: [{
        role: 'cancel',
        text: 'Cancelar'
      }, {
        text: 'Eliminar',
        handler: (value) => {
          this.activitiesService.delete(activity)
            .then(() => {
              this.toastController.create({
                message: `La <strong>Actividad ${activity.position}: ${activity.name}</strong> ha sido eliminada correctamente`,
                duration: 3000
              }).then(toast => toast.present());
            });
        }
      }]
    }).then(alert => alert.present());
  }

  filterActivities = (event: CustomEvent) => {
    this.disableReorder = true;
    const filterValue: string = event.detail.value.toLowerCase();
    if (filterValue.length > 0) {
      if (isNaN(Number(filterValue))) {
        this.activities = this.filteredActivities.filter(activity => filterValue.split(' ').every(filter =>
          activity.name.toLowerCase().indexOf(filter) >= 0));
      } else {
        this.activities = this.activities.filter(activity => activity.position === Number(filterValue));
      }
    } else {
      this.activities = [...this.filteredActivities];
    }
  }

  doReorder = async (event: CustomEvent) => {
    const {from, to} = event.detail;
    const fixedTo = to === this.activities.length ? to - 1 : to; // fix for some weird behavior
    const fromActivity = this.activities[from];
    const toActivity = this.activities[fixedTo];
    event.detail.complete();
    await this.activitiesService.changePosition(fromActivity.uid, from + 1, toActivity.uid, fixedTo + 1);
  }

  showSaveGrades = (activity: Activity) => this.modalController.create({
      component: ModalActivityGradesComponent,
      componentProps: { activity }
    }).then(modal => modal.present())

  showOverviewActivities = () => this.modalController.create({
    component: ModalActivitiesOverviewComponent
  }).then(modal => modal.present())

}
