import {Component, Input, OnInit} from '@angular/core';
import {Student} from '../../models/student.class';
import {AlertController, ToastController} from '@ionic/angular';
import {StudentsService} from '../../services/students.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent implements OnInit {

  @Input() students: Student[];
  filteredStudents: Student[];

  constructor(private alertController: AlertController,
              private toastController: ToastController,
              private studentsService: StudentsService) { }

  ngOnInit() { }

  filterStudents = (event: CustomEvent) => {
    const filterValue: string = event.detail.value.toLowerCase();
    if (!this.filteredStudents) {
      this.filteredStudents = [...this.students];
    }
    this.students = [...this.filteredStudents];

    if (filterValue.length > 0) {
      const arrFilter = filterValue.split(' ');
      this.students = this.students.filter(student => arrFilter.every(filter =>
        student.name.toLowerCase().indexOf(filter) >= 0 ||
        student.lastName.toLowerCase().indexOf(filter) >= 0));
    }
  }

  showEditStudent = (student: Student) => {
    this.alertController.create({
      header: 'Editar Alumno',
      subHeader: 'Ingresa los datos del alumno',
      inputs: [{
        type: 'text',
        name: 'name',
        value: student.name,
        placeholder: 'Nombres del alumno'
      }, {
        type: 'text',
        name: 'lastName',
        value: student.lastName,
        placeholder: 'Apellidos del alumno'
      }],
      buttons: [{
        role: 'cancel',
        text: 'Cancelar'
      }, {
        text: 'Guardar',
        handler: (value) => {
          const updatedStudent = new Student(value.name, value.lastName);
          this.studentsService.update(student.uid, updatedStudent)
            .then(() => {
              this.toastController.create({
                message: `El alumno ${updatedStudent.name} ha sido editado correctamente`,
                duration: 3000
              }).then(toast => toast.present());
            });
        }
      }]
    }).then(alert => alert.present());
  }

  showDeleteStudent = (student: Student) => {
    this.alertController.create({
      header: 'Eliminar Alumno',
      subHeader: `¿Está seguro que desea eliminar al alumno?`,
      message: `${student.name} ${student.lastName}`,
      buttons: [{
        role: 'cancel',
        text: 'Cancelar'
      }, {
        text: 'Eliminar',
        handler: (value) => {
          this.studentsService.delete(student.uid)
            .then(() => {
              this.toastController.create({
                message: `El alumno ${student.name} ha sido eliminado correctamente`,
                duration: 3000
              }).then(toast => toast.present());
            });
        }
      }]
    }).then(alert => alert.present());
  }

}
