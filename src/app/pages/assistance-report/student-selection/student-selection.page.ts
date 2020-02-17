import {Component, OnInit, ViewChild} from '@angular/core';
import {IonDatetime, LoadingController, NavController, ToastController} from '@ionic/angular';
import {Student} from '../../../models/student.class';
import {GroupsService} from '../../../services/groups.service';
import {ActivatedRoute} from '@angular/router';
import {StudentsService} from '../../../services/students.service';

@Component({
  selector: 'app-student-selection',
  templateUrl: './student-selection.page.html',
  styleUrls: ['./student-selection.page.scss'],
})
export class StudentSelectionPage implements OnInit {

  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  initialDate: Date;
  finalDate: Date;
  loading = true;
  students: Student[];
  @ViewChild('finalDate', { static: true }) finalIonDatetime: IonDatetime;

  constructor(private loadingController: LoadingController,
              private groupsService: GroupsService,
              private studentsService: StudentsService,
              private activatedRoute: ActivatedRoute,
              private navController: NavController,
              private toastController: ToastController) { }

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

  setInitialDate = (event: CustomEvent) => {
    this.finalIonDatetime.value = null;
    this.initialDate = event.detail.value;
  }

  setFinalDate = (event: CustomEvent) => {
    if (event.detail.value !== null) {
      this.finalDate = event.detail.value;
    }
  }

  filterStudents = (event: CustomEvent) => {
    const filterValue: string = event.detail.value.toLowerCase();
    if (filterValue.length > 0) {
      this.students = this.studentsService.filterStudents(filterValue);
    } else {
      this.students = [...this.studentsService.students];
    }
  }

  showAssistanceCard = (student: Student) => {
    if (this.finalDate) {
      this.navController.navigateForward(['../assistanceCard'], {
        state: { student, initialDate: this.initialDate, finalDate: this.finalDate },
        relativeTo: this.activatedRoute
      });
    } else {
      this.toastController.create({
        message: 'Debes seleccionar un rango valido de fechas',
        duration: 3000
      }).then(toast => toast.present());
    }
  }

}
