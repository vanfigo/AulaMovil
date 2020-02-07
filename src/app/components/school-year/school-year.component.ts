import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {SchoolYear} from '../../models/school-year.class';
import {AlertController, IonSelect, PickerController, ToastController} from '@ionic/angular';
import * as moment from 'moment';
import {DocumentSnapshot} from '@angular/fire/firestore';
import {SchoolYearsService} from '../../services/school-years.service';

@Component({
  selector: 'app-school-year',
  templateUrl: './school-year.component.html',
  styleUrls: ['./school-year.component.scss'],
})
export class SchoolYearComponent implements OnInit {

  schoolYears: Observable<SchoolYear[]>;
  @ViewChild(IonSelect, {static: false}) schoolYearSelect: IonSelect;
  @Output() schoolYear = new EventEmitter<SchoolYear>();
  customAlertOptions: any = {
    header: 'Cíclo Escolar',
    message: 'Ve tus grupos del cíclo escolar',
    translucent: true
  };

  constructor(private schoolYearsService: SchoolYearsService,
              private pickerController: PickerController,
              private toastController: ToastController,
              private alertController: AlertController) {
    this.schoolYears = schoolYearsService.findAll();
  }

  ngOnInit() {}

  showAlertDeleteSchoolYear = () => {
    const schoolYear: SchoolYear = this.schoolYearSelect.value;
    this.alertController.create({
      header: 'Eliminar Cíclo Escolar',
      subHeader: `¿Estás seguro que quieres eliminar el ciclo escolar ${schoolYear.name}?`,
      buttons: [{
        role: 'cancel',
        text: 'Cancelar'
      }, {
        text: 'Eliminar',
        handler: () => this.deleteSchoolYear(schoolYear)
      }]
    }).then(alert => alert.present());
  }

  deleteSchoolYear = (schoolYear: SchoolYear) => {
    this.schoolYearsService.delete(schoolYear.uid)
      .then(() => {
        this.toastController.create({
          message: `El cíclo escolar ${schoolYear.name} ha sido eliminado`,
          duration: 3000
        }).then(toaster => {
          toaster.present();
          this.schoolYearSelect.value = null;
        });
      });
  }

  showAddSchoolYear = async () => {
    const options = [];
    for (let i = -2; i < 10; i++) {
      const date = moment().add(i, 'years');
      options.push({
        value: date,
        text: date.format('YYYY')
      });
    }
    const picker = await this.pickerController.create({
      columns: [{
        name: 'years',
        options
      }],
      buttons: [{
        text: 'Cancelar',
        role: 'cancel'
      }, {
        text: 'Seleccionar',
        handler: this.createSchoolYear
      }]
    });
    await picker.present();
  }

  createSchoolYear = (value) => {
    const schoolYear = new SchoolYear(value.years.value.toDate());
    this.schoolYearsService.findByUid(schoolYear.uid)
      .toPromise().then(async (storedSchoolYear: DocumentSnapshot<SchoolYear>) => {
      if (storedSchoolYear.exists) {
        this.toastController.create({
          message: `El cíclo escolar ${schoolYear.name} ya existe`,
          duration: 3000
        }).then(toaster => toaster.present());
      } else {
        this.schoolYearsService.save(schoolYear)
          .then(async () => {
            this.toastController.create({
              message: `El cíclo escolar ${schoolYear.name} fue creado exitosamente`,
              duration: 3000
            }).then(toaster => {
              this.schoolYearSelect.open();
              toaster.present();
            });
          });
      }
    });
  }

  schoolYearSelected = (event: CustomEvent) => {
    console.log(event.detail.value);
    this.schoolYear.emit(event.detail.value);
  }

}
