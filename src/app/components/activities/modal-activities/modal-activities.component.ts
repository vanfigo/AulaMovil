import {Component, Input, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {FormControl, FormGroup} from '@angular/forms';
import {Activity} from '../../../models/activity.class';
import {ActivitiesService} from '../../../services/activities.service';
import {DocumentSnapshot} from '@angular/fire/firestore';

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
              private toastController: ToastController) { }

  ngOnInit() {
    this.formActivity = new FormGroup({
      name: new FormControl(this.activity ? this.activity.name : ''),
      dueDate: new FormControl(this.activity && this.activity.dueDate ? this.activity.dueDate.toLocaleString() : '')
    });
  }

  saveActivity = () => {
    const {name, dueDate} = this.formActivity.value;
    const truncatedDate = dueDate ?
      new Date(new Date(dueDate).getFullYear(), new Date(dueDate).getMonth(), new Date(dueDate).getDate()) : null;
    if (this.activity) {
      this.activity.name = name;
      this.activity.dueDate = truncatedDate;
      this.activitiesService.update(this.activity).then(() => this.presentToast(this.activity));
    } else {
      const activity: Activity = new Activity(name, truncatedDate);
      this.activitiesService.save(activity)
        .then((activityRef) => activityRef.get())
        .then((storedActivity: DocumentSnapshot<Activity>) => this.presentToast(storedActivity.data()));
    }
  }

  presentToast = (activity: Activity) => {
    this.toastController.create({
      message: `La <strong>Actividad ${activity.position}: ${activity.name ? activity.name : 'Sin nombre'}</strong>` +
        ' ha sido guardada correctamente',
      duration: 3000
    }).then(toast => {
      toast.present();
      this.modalController.dismiss();
    });
  }

}
