import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {SchoolYear} from '../../models/school-year.class';
import {IonInput, PickerController} from '@ionic/angular';
import * as moment from 'moment';
import {DocumentSnapshot} from '@angular/fire/firestore';
import {SchoolYearsService} from '../../services/school-years.service';

@Component({
  selector: 'app-school-year',
  templateUrl: './school-year.component.html',
  styleUrls: ['./school-year.component.scss'],
})
export class SchoolYearComponent implements OnInit {

  @Output() schoolYear = new EventEmitter<SchoolYear>();
  @ViewChild(IonInput, {static: false}) schoolYearSelect: IonInput;

  constructor(private schoolYearsService: SchoolYearsService,
              private pickerController: PickerController) {
  }

  ngOnInit() {}

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
    this.schoolYearsService.findByUid(schoolYear.uid)
      .subscribe((document: DocumentSnapshot<SchoolYear>) => {
        if (!document.exists) {
          this.schoolYearsService.save(schoolYear)
            .then(() => this.schoolYearSelected(schoolYear));
        } else {
          this.schoolYearSelected(document.data());
        }
      });
  }

  schoolYearSelected = (schoolYear: SchoolYear) => {
    this.schoolYearSelect.value = schoolYear.name;
    this.schoolYear.emit(schoolYear);
  }

}
