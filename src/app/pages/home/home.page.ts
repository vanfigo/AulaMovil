import {Component, ViewChild} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {SchoolYear} from '../../models/school-year.class';
import {ActionSheetController, AlertController, IonInput, NavController, PickerController, ToastController} from '@ionic/angular';
import {StorageService} from '../../services/storage.service';
import * as moment from 'moment';
import {Group} from '../../models/group.class';
import {GroupsService} from '../../services/groups.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  groups: Group[];
  schoolYear: SchoolYear;
  loading = false;
  @ViewChild(IonInput, {static: false}) schoolYearSelect: IonInput;

  constructor(public authService: AuthService,
              private pickerController: PickerController,
              private alertController: AlertController,
              private toastController: ToastController,
              private storageService: StorageService,
              private groupsService: GroupsService,
              private actionSheetController: ActionSheetController,
              private navController: NavController) {
    storageService.get('schoolYear')
      .then((schoolYear: any) => {
        if (schoolYear) {
          this.schoolYear = schoolYear;
          this.schoolYearSelect.value = schoolYear.name;
          this.findGroups();
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
    this.loading = true;
    this.groups = [];
    this.groupsService.findAllBySchoolYearUid(this.schoolYear.uid)
      .subscribe(groups => {
        this.groups = groups;
        this.loading = false;
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
        text: 'Reporte de Asistencia',
        icon: 'checkmark-done-circle',
        handler: () => {
          console.log('Reporte de Asistencia clicked');
        }
      }, {
        text: 'Reporte de Actividades',
        icon: 'school',
        handler: () => {
          this.navController.navigateForward(['/group', group.uid, 'activitiesReport']);
        }
      }, {
        text: 'Cancelar',
        role: 'cancel',
        icon: 'close',
        handler: () => {
          console.log('Cancelar clicked');
        }
      }]
    }).then(actionSheet => actionSheet.present());
  }

}
