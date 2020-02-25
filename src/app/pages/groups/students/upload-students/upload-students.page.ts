import {Component, OnInit} from '@angular/core';
import {NavController, ToastController} from '@ionic/angular';
import * as papa from 'papaparse';
import {ParseResult} from 'papaparse';
import {Student} from '../../../../models/student.class';
import {FormControl, FormGroup} from '@angular/forms';
import {StudentsService} from '../../../../services/students.service';

@Component({
  selector: 'app-upload-students',
  templateUrl: './upload-students.page.html',
  styleUrls: ['./upload-students.page.scss'],
})
export class UploadStudentsPage implements OnInit {

  file: File;
  withHeaders: boolean;
  students: Student[] = [];
  loading = true;
  uploadStudentsFormGroup: FormGroup;

  constructor(private toastController: ToastController,
              private studentsService: StudentsService,
              private navController: NavController) { }

  ngOnInit() {
    this.uploadStudentsFormGroup = new FormGroup({
      file: new FormControl(''),
      headers: new FormControl(false)
    });
  }

  fileSelected = (element: HTMLInputElement) => {
    this.file = element.files.item(0);
  }

  uploadStudentsFile = () => {
    this.students = [];
    this.loading = true;
    if (this.file.type === 'text/csv' || this.file.type === 'text/comma-separated-values') {
      papa.parse(this.file, {
        header: this.withHeaders,
        delimiter: ',',
        complete: (result: ParseResult) => {
          let message = '';
          if (this.withHeaders) {
            message = result.meta.fields.length !== 2 ? 'Los cabeceros deben ser 2' : message;
            if (message.length === 0) {
              const nameField = result.meta.fields[0];
              const lastNameField = result.meta.fields[1];
              result.data.forEach(record => {
                message = Object.keys(record).length !== 2 ? 'Los registros deben de tener 2 columnas' : message;
                this.students.push(new Student(record[nameField], record[lastNameField]));
              });
            } else {
              message = 'El nombre de columnas deben ser 2';
            }
          } else {
            result.data.forEach(record => {
              message = record.length !== 2 ? 'Los registros deben de tener 2 columnas' : message;
              this.students.push(new Student(record[0], record[1]));
            });
          }
          if (message.length > 0) {
            this.toastController.create({ message, duration: 3000 }).then(toast => toast.present());
          }
          this.loading = false;
        }
      });
    } else {
      this.toastController.create({
        message: `Solo se permiten archivos <strong>CSV</strong>: ${this.file.type}`,
        duration: 3000
      }).then(toast => toast.present());
    }
  }

  saveStudents = () => {
    this.students.forEach(async (student: Student) => {
      await this.studentsService.save(student);
    });
    this.uploadStudentsFormGroup.reset();
    this.loading = true;
    this.toastController.create({
      message: `${this.students.length} ${this.students.length === 1 ? 'alumno fue dado' : 'alumnos fueron dados'} de alta en el grupo`,
      duration: 3000
    }).then(async toast => {
      await toast.present();
      this.navController.back();
    });
  }

}
