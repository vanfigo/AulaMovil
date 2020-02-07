import {Component, OnInit} from '@angular/core';
import {AlertController, ToastController} from '@ionic/angular';
import {GroupsService} from '../../services/groups.service';
import {SchoolYear} from '../../models/school-year.class';
import {Group} from '../../models/group.class';
import {SchoolYearsService} from '../../services/school-years.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {

  groups: Group[];
  schoolYear: SchoolYear;
  loading = false;

  constructor(private alertController: AlertController,
              private groupsService: GroupsService,
              private schoolYearsService: SchoolYearsService,
              private toastController: ToastController) { }

  ngOnInit() {}

  selectedSchoolYear = (schoolYear: SchoolYear) => {
    this.schoolYear = schoolYear;
    this.schoolYearsService.schoolYearUid = schoolYear.uid;
    if (schoolYear) {
      this.loading = true;
      this.groupsService.findAllBySchoolYearUid()
        .subscribe(groups => {
          this.groups = groups;
          this.loading = false;
        });
    } else {
      this.groups = null;
    }
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
          const group: Group = new Group(value.groupName);
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

}
