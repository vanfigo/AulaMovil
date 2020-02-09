import {Component, Input, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Activity} from '../../../models/activity.class';
import {ActivitiesService} from '../../../services/activities.service';
import {GroupsService} from '../../../services/groups.service';

@Component({
  selector: 'app-modal-activities',
  templateUrl: './modal-activities.component.html',
  styleUrls: ['./modal-activities.component.scss'],
})
export class ModalActivitiesComponent implements OnInit {

  formActivity: FormGroup;
  @Input() activity: Activity;
  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  constructor(public modalController: ModalController,
              private activitiesService: ActivitiesService,
              private toastController: ToastController,
              private groupsService: GroupsService) { }

  ngOnInit() {
    this.formActivity = new FormGroup({
      name: new FormControl(this.activity ? this.activity.name : ''),
      dueDate: new FormControl(this.activity ? this.activity.dueDate : ''),
      minScore: new FormControl(this.activity ? this.activity.minScore : 5, [
        Validators.required,
        Validators.min(0),
        Validators.max(10)
      ])
    });
  }

  getMinScoreError = () => {
    const errors = this.formActivity.get('minScore').errors;
    if (errors.required) {
      return 'requerido';
    } else if (errors.max) {
      return 'Máximo 10';
    } else {
      return 'Mínimo 0';
    }
  }

  saveActivity = () => {
    const {name, dueDate, minScore} = this.formActivity.value;
    if (this.activity) {
      this.activity.name = name;
      this.activity.dueDate = dueDate;
      this.activity.minScore = minScore;
      this.activitiesService.update(this.activity).then(() => this.presentToast(this.activity));
    } else {
      const activity: Activity = new Activity(name, dueDate, minScore);
      this.activitiesService.save(activity).then(() => this.presentToast(activity));
    }
  }

  presentToast = (activity: Activity) => {
    this.toastController.create({
      message: `La <strong>Actividad ${activity.position}: ${activity.name}</strong> ha sido guardada correctamente`,
      duration: 3000
    }).then(toast => {
      toast.present();
      this.modalController.dismiss();
    });
  }

}
