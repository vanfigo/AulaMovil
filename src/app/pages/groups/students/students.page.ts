import {Component, OnInit} from '@angular/core';
import {StudentsService} from '../../../services/students.service';
import {Student} from '../../../models/student.class';
import {GroupsService} from '../../../services/groups.service';
import {AlertController, LoadingController, NavController, ToastController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';

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
              private activatedRoute: ActivatedRoute,
              private alertController: AlertController,
              private toastController: ToastController,
              private loadingController: LoadingController,
              private navController: NavController) { }

  async ngOnInit() {
    const loadingPop = await this.loadingController.create({ message: 'Cargando...' });
    await loadingPop.present();
    this.groupsService.findByUid(this.activatedRoute.snapshot.params.groupUid).toPromise().then(group => {
      this.groupsService.group = group;
      loadingPop.dismiss();
      this.studentsService.findAllByGroupUid()
        .subscribe(students => {
          this.studentsService.students = students;
          this.students = students;
          this.loading = false;
        });
    });
  }

  filterStudents = (event: CustomEvent) => {
    const filterValue: string = event.detail.value.toLowerCase();
    if (filterValue.length > 0) {
      this.students = this.studentsService.filterStudents(filterValue);
    } else {
      this.students = [...this.studentsService.students];
    }
  }

  showAddStudent = () => {
    this.alertController.create({
      header: 'Agregar Alumno',
      subHeader: 'Ingresa los datos del alumno',
      inputs: [{
        type: 'text',
        name: 'name',
        label: 'Nombre(s)',
        placeholder: 'Nombres del alumno'
      }, {
        type: 'text',
        name: 'lastName',
        label: 'Apellido(s)',
        placeholder: 'Apellidos del alumno'
      }],
      buttons: [{
        role: 'cancel',
        text: 'Cancelar'
      }, {
        text: 'Agregar',
        handler: (value) => {
          const student = new Student(value.name, value.lastName);
          this.loading = true;
          this.studentsService.save(student)
            .then(() => {
              this.toastController.create({
                message: `El alumno ${student.name} ha sido agregado al grupo ${this.groupsService.group.name}`,
                duration: 3000
              }).then(async (toast) => {
                await toast.present();
                this.loading = false;
              });
            });
        }
      }]
    }).then(alert => alert.present());
  }

  showEditStudent = (student: Student) => {
    this.alertController.create({
      header: 'Editar Alumno',
      subHeader: 'Ingresa los datos del alumno',
      inputs: [{
        type: 'text',
        name: 'name',
        value: student.displayName,
        placeholder: 'Nombres del alumno'
      }, {
        type: 'text',
        name: 'lastName',
        value: student.displayLastName,
        placeholder: 'Apellidos del alumno'
      }],
      buttons: [{
        role: 'cancel',
        text: 'Cancelar'
      }, {
        text: 'Guardar',
        handler: (value) => {
          const updatedStudent = new Student(value.name, value.lastName);
          delete updatedStudent.creationDate; // don't update creation date
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

  showPendingActivities = (student: Student) => this.navController
    .navigateForward(['pending-activities'], { state: { student }, relativeTo: this.activatedRoute })

  showUploadStudents = () => this.navController
    .navigateForward(['upload-students'], { relativeTo: this.activatedRoute })

}
