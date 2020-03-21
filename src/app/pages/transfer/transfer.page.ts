import {Component, OnInit} from '@angular/core';
import {AlertController, LoadingController, ModalController, ToastController} from '@ionic/angular';
import {ModalGroupsComponent} from '../../components/modal-groups/modal-groups.component';
import {Group} from '../../models/group.class';
import {StorageService} from '../../services/storage.service';
import {GroupsService} from '../../services/groups.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.page.html',
  styleUrls: ['./transfer.page.scss'],
})
export class TransferPage implements OnInit {

  originGroup: Group;
  destinyGroup: Group;

  constructor(private modalController: ModalController,
              private alertController: AlertController,
              private storageService: StorageService,
              private toastController: ToastController,
              private loadingController: LoadingController,
              private groupsService: GroupsService) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.storageService.get('hideTransferAlert')
      .then(hide => {
        if (hide === null) {
          this.alertController.create({
            header: 'Transferencia de recursos',
            message: 'Aquí puedes copiar recursos (alumnos o actividades) de un grupo a otro',
            inputs: [{
              name: 'hideAlert',
              value: true,
              type: 'checkbox',
              label: 'No mostrar este mensaje'
            }],
            buttons: [{
              text: 'Aceptar',
              handler: (response) => {
                if (response.length > 0) {
                  this.storageService.set('hideTransferAlert', true);
                }
                this.alertController.dismiss();
              }
            }]
          }).then(alert => alert.present());
        }
      });
  }

  showModalGroups = (origin: boolean) => {
    this.modalController.create({
      component: ModalGroupsComponent
    }).then(modal => {
      modal.present();
      modal.onDidDismiss().then((group) => {
        if (origin) {
          this.originGroup = group.data as Group;
          this.destinyGroup = null;
        } else {
          this.destinyGroup = group.data as Group;
        }
      });
    });
  }

  showTransferStudents = () => {
    if (this.originGroup.uid === this.destinyGroup.uid) {
      this.toastController.create({
        message: 'El grupo origen es el mismo que el grupo destino',
        duration: 3000
      }).then(toast => toast.present());
    } else {
      this.alertController.create({
        header: 'Transferir Alumnos',
        subHeader: '¿Estás seguro que deseas transferir los alumnos?',
        message: `Esta acción transferirá ${this.originGroup.students} alumnos del grupo ` +
          `<strong>${this.originGroup.name}</strong> al grupo <strong>${this.destinyGroup.name}</strong>`,
        buttons: [{
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Transferir',
          handler: () => {
            this.loadingController.create({
              message: 'Transfiriendo...'
            }).then(async loading => {
              await loading.present();
              await this.groupsService.transferStudents(this.originGroup.uid, this.destinyGroup.uid);
              this.destinyGroup.students += this.originGroup.students;
              this.toastController.create({
                message: `Se han transferido ${this.originGroup.students} ` +
                  `${this.originGroup.students === 1 ? 'alumno' : 'alumnos'} exitosamente`,
                duration: 3000
              }).then(toast => toast.present());
              await loading.dismiss();
            });
          }
        }]
      }).then(alert => alert.present());
    }
  }

  showTransferActivities = () => {
    if (this.originGroup.uid === this.destinyGroup.uid) {
      this.toastController.create({
        message: 'El grupo origen es el mismo que el grupo destino',
        duration: 3000
      }).then(toast => toast.present());
    } else {
      this.alertController.create({
        header: 'Transferir Actividades',
        subHeader: '¿Estás seguro que deseas transferir las actividades?',
        message: `Esta acción transferirá ${this.originGroup.activities} actividades del grupo ` +
          `<strong>${this.originGroup.name}</strong> al grupo <strong>${this.destinyGroup.name}</strong>`,
        buttons: [{
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Transferir',
          handler: () => {
            this.loadingController.create({
              message: 'Transfiriendo...'
            }).then(async loading => {
              await loading.present();
              await this.groupsService.transferActivities(this.originGroup.uid, this.destinyGroup.uid);
              this.destinyGroup.activities += this.originGroup.activities;
              this.toastController.create({
                message: `Se han transferido ${this.originGroup.activities} ` +
                  `${this.originGroup.activities === 1 ? 'actividad' : 'actividades'} exitosamente`,
                duration: 3000
              }).then(toast => toast.present());
              await loading.dismiss();
            });
          }
        }]
      }).then(alert => alert.present());
    }
  }

}
