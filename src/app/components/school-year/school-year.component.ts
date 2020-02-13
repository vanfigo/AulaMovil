import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {SchoolYear} from '../../models/school-year.class';
import {IonInput, PickerController} from '@ionic/angular';
import * as moment from 'moment';
import {Plugins} from '@capacitor/core';

const { Storage } = Plugins;

@Component({
  selector: 'app-school-year',
  templateUrl: './school-year.component.html',
  styleUrls: ['./school-year.component.scss'],
})
export class SchoolYearComponent implements OnInit {

  @Output() schoolYear = new EventEmitter<SchoolYear>();
  @ViewChild(IonInput, {static: false}) schoolYearSelect: IonInput;

  constructor(private pickerController: PickerController) { }

  ngOnInit() {
    Storage.get({ key: 'schoolYear' }).then(value => {
      if (value.value !== null) {
        this.selectSchoolYear(JSON.parse(value.value));
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
        handler: this.createSchoolYear
      }]
    });
    await picker.present();
  }

  createSchoolYear = (value) => {
    const schoolYear: SchoolYear = value.schoolYear.value;
    Storage.set({
      key: 'schoolYear',
      value: JSON.stringify(schoolYear)
    }).then(() => {
      this.selectSchoolYear(schoolYear);
    });
  }

  selectSchoolYear = (schoolYear: SchoolYear) => {
    this.schoolYear.emit(schoolYear);
    this.schoolYearSelect.value = schoolYear.name;
  }

  clearSchoolYear = () => this.schoolYearSelect.value = null;

}
