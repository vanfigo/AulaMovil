import {Component, ViewChild} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {SchoolYear} from '../../models/school-year.class';
import {
  ActionSheetController,
  AlertController,
  IonInput,
  LoadingController,
  NavController,
  PickerController,
  ToastController
} from '@ionic/angular';
import {StorageService} from '../../services/storage.service';
import * as moment from 'moment';
import {Group} from '../../models/group.class';
import {GroupsService} from '../../services/groups.service';
import {SubscriptionsService} from '../../services/subscriptions.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  groups: Group[];
  schoolYear: SchoolYear;
  subscriptionSub = new Subscription();
  hasActiveSubscription = true;
  groupLoading = false;
  loading = true;
  @ViewChild(IonInput, {static: true}) schoolYearSelect: IonInput;

  constructor(public authService: AuthService,
              private pickerController: PickerController,
              private alertController: AlertController,
              private toastController: ToastController,
              private storageService: StorageService,
              private groupsService: GroupsService,
              private actionSheetController: ActionSheetController,
              private navController: NavController,
              private loadingController: LoadingController,
              public subscriptionsService: SubscriptionsService) { }

  ionViewWillEnter() {
    this.subscriptionSub = this.subscriptionsService.getActive().subscribe((subscription) => {
      this.hasActiveSubscription = !!subscription;
      if (this.hasActiveSubscription) {
        this.selectSchoolYear();
      }
      this.loading = false;
    });
  }

  ionViewDidLeave() {
    this.subscriptionSub.unsubscribe();
  }

  selectSchoolYear = () => {
    this.storageService.get('schoolYear')
      .then(async (schoolYear: any) => {
        if (schoolYear) {
          this.schoolYear = schoolYear;
          this.schoolYearSelect.value = schoolYear.name;
          this.findGroups();
        } else {
          this.schoolYear = null;
          this.schoolYearSelect.value = '';
        }
      });
  }

  showAddSchoolYear = async () => {
    const options = [];
    for (let i = -2; i < 10; i++) {
      const date = moment().add(i, 'years');
      const schoolYear = new SchoolYear(date.toDate());
      options.push({
        value: schoolYear,
        text: schoolYear.name
      });
    }
    const picker = await this.pickerController.create({
      columns: [{
        name: 'schoolYear',
        options
      }],
      buttons: [{
        text: 'Cancelar',
        role: 'cancel'
      }, {
        text: 'Seleccionar',
        handler: (value) => {
          this.schoolYear = value.schoolYear.value;
          this.schoolYearSelect.value = this.schoolYear.name;
          this.storageService.set('schoolYear', this.schoolYear);
          this.findGroups();
        }
      }]
    });
    await picker.present();
  }

  findGroups = () => {
    this.groupLoading = true;
    this.groups = [];
    this.groupsService.findAllBySchoolYearUid(this.schoolYear.uid)
      .subscribe(groups => {
        this.groups = groups;
        this.groupLoading = false;
      });
  }

  showAddGroup = () => {
    this.alertController.create({
      header: 'Agregar Grupo',
      subHeader: 'Elige un nombre para tu grupo',
      inputs: [{
        type: 'text',
        name: 'groupName',
        placeholder: 'Nombre del grupo'
      }],
      buttons: [{
        role: 'cancel',
        text: 'Cancelar'
      }, {
        text: 'Agregar',
        handler: (value) => {
          const group: Group = new Group(value.groupName, this.schoolYear.uid);
          this.groupLoading = true;
          this.groupsService.save(group)
            .then(() => {
              this.toastController.create({
                message: `El grupo ${group.name} ha sido creado exitosamente`,
                duration: 3000
              }).then(toast => toast.present());
            });
        }
      }]
    }).then(alert => alert.present());
  }

  showEditGroup = (group: Group) => {
    this.alertController.create({
      header: 'Editar Grupo',
      subHeader: 'Elige un nombre para tu grupo',
      inputs: [{
        type: 'text',
        name: 'groupName',
        placeholder: 'Nombre del grupo',
        value: group.name
      }],
      buttons: [{
        role: 'cancel',
        text: 'Cancelar'
      }, {
        text: 'Guardar',
        handler: (value) => {
          group.name = value.groupName.toUpperCase();
          this.groupsService.update(group)
            .then(() => {
              this.toastController.create({
                message: `El grupo ${group.name} ha sido guardado exitosamente`,
                duration: 3000
              }).then(toast => toast.present());
            });
        }
      }]
    }).then(alert => alert.present());
  }

  showDeleteGroup = (group: Group) => {
    this.alertController.create({
      header: 'Eliminar Grupo',
      subHeader: group.name,
      message: 'Al eliminar el grupo se eliminaran los alumnos, asistencias y actividades registradas',
      buttons: [{
        role: 'cancel',
        text: 'Cancelar'
      }, {
        text: 'Eliminar',
        handler: () => {
          this.loadingController.create({ message: 'Eliminando...' })
            .then(async (load) => {
              await load.present();
              this.groupsService.delete(group.uid).then(async () => {
                await load.dismiss();
                this.toastController.create({
                  message: `El grupo ${group.name} fue eliminado exitosamente`,
                  duration: 3000
                }).then(toast => toast.present());
              });
            });
        }
      }]
    }).then(alert => alert.present());
  }

  showGroupAction = (group: Group) => {
    this.actionSheetController.create({
      header: `Grupo ${group.name}`,
      buttons: [{
        text: 'Alumnos',
        icon: 'person',
        handler: () => {
          this.navController.navigateForward(['/group', group.uid, 'students']);
        }
      }, {
        text: 'Asistencia',
        icon: 'checkmark-circle',
        handler: () => {
          this.navController.navigateForward(['/group', group.uid, 'assistance']);
        }
      }, {
        text: 'Actividades',
        icon: 'bookmarks',
        handler: () => {
          this.navController.navigateForward(['/group', group.uid, 'activities']);
        }
      }, {
        text: 'Reporte de Asistencias',
        icon: 'checkmark-done-circle',
        handler: () => {
          this.navController.navigateForward(['/group', group.uid, 'assistance-report']);
        }
      }, {
        text: 'Reporte de Actividades',
        icon: 'school',
        handler: () => {
          this.navController.navigateForward(['/group', group.uid, 'activities-report']);
        }
      }, {
        text: 'Cancelar',
        role: 'cancel',
        icon: 'close',
        handler: () => { }
      }]
    }).then(actionSheet => actionSheet.present());
  }

  showSubscriptionPage = () => this.navController.navigateForward(['/subscription']);

}
