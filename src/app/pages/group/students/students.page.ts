import {Component, OnInit} from '@angular/core';
import {StudentsService} from '../../../services/students.service';
import {Student} from '../../../models/student.class';
import {GroupsService} from '../../../services/groups.service';
import {AlertController, ToastController} from '@ionic/angular';

@Component({
  selector: 'app-students-page',
  templateUrl: './students.page.html',
  styleUrls: ['./students.page.scss'],
})
export class StudentsPage implements OnInit {

  loading = true;
  students: Student[];

  constructor(private studentsService: StudentsService,
              private groupsService: GroupsService,
              private alertController: AlertController,
              private toastController: ToastController) {
    studentsService.findAllByGroupUid(groupsService.group.uid)
      .subscribe(students => {
        console.log('students', students);
        this.students = students;
        this.loading = false;
    });
  }

  ngOnInit() { }

  showAddStudent = () => {
    this.alertController.create({
      header: 'Agregar Alumno',
      subHeader: 'Ingresa los datos del alumno',
      inputs: [{
        type: 'text',
        name: 'name',
        placeholder: 'Nombres del alumno'
      }, {
        type: 'text',
        name: 'lastName',
        placeholder: 'Apellidos del alumno'
      }],
      buttons: [{
        role: 'cancel',
        text: 'Cancelar'
      }, {
        text: 'Agregar',
        handler: (value) => {
          const student = new Student(value.name, value.lastName);
          this.studentsService.save(student)
            .then(() => {
              this.toastController.create({
                message: `El alumno ${student.name} ha sido agregado al grupo ${this.groupsService.group.name}`,
                duration: 3000
              }).then(toast => toast.present());
            });
        }
      }]
    }).then(alert => alert.present());
  }

}
