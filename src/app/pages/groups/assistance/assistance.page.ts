import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Student} from '../../../models/student.class';
import {StudentsService} from '../../../services/students.service';
import {GroupsService} from '../../../services/groups.service';
import {IonCheckbox, IonDatetime, LoadingController, ToastController} from '@ionic/angular';
import {Assistance} from '../../../models/assistance.class';
import {AssistancesService} from '../../../services/assistances.service';
import * as moment from 'moment';
import {DocumentSnapshot} from '@angular/fire/firestore';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-assistance',
  templateUrl: './assistance.page.html',
  styleUrls: ['./assistance.page.scss'],
})
export class AssistancePage implements OnInit {

  loading = false;
  students: Student[];
  selectedStudents: Student[] = [];
  assistance: Assistance;
  assistanceDate: Date;
  studentCheckBoxSub = new Subscription();
  @ViewChildren(IonCheckbox) studentCheckbox: QueryList<IonCheckbox>;
  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  constructor(private studentsService: StudentsService,
              private groupsService: GroupsService,
              private assistanceService: AssistancesService,
              private toastController: ToastController,
              private activatedRoute: ActivatedRoute,
              private loadingController: LoadingController) { }

  ngOnInit() {
    this.loadingController.create({ message: 'Cargando...' })
      .then(async loadingPop => {
        await loadingPop.present();
        this.groupsService.findByUid(this.activatedRoute.snapshot.params.groupUid).toPromise().then(group => {
          this.groupsService.group = group;
          this.assistanceDate = moment().toDate();
          loadingPop.dismiss();
        });
      });
  }

  ionViewDidEnter() {
    this.studentCheckBoxSub = this.studentCheckbox.changes.subscribe(this.updateSelectedCheckBox);
  }

  ionViewWillLeave() {
    this.studentCheckBoxSub.unsubscribe();
  }

  updateSelectedCheckBox = () => this.studentCheckbox.forEach((checkBox: IonCheckbox) => {
    if (this.selectedStudents.find((student: Student) => checkBox.name === student.uid)) {
      checkBox.checked = true;
    }
  })

  selectStudent = (event: CustomEvent, student: Student) => {
    if (event.detail.checked) {
      if (!this.selectedStudents.find(selectedStudent => selectedStudent.uid === student.uid)) {
        this.selectedStudents.push(student);
      }
    } else {
      this.selectedStudents = this.selectedStudents.filter((storedStudent: Student) => storedStudent.uid !== student.uid);
    }
  }

  validateAssistance = (event: IonDatetime) => {
    this.loading = true;
    this.assistance = new Assistance(new Date(event.value));
    if (!this.students) {
      this.studentsService.findAllByGroupUid().subscribe(students => {
        this.studentsService.students = students;
        this.students = students;
        this.searchAssistance();
      });
    } else {
      this.searchAssistance();
    }
  }

  searchAssistance = () => {
    this.assistanceService.findByUid(this.assistance.uid)
      .subscribe((storedAssistance: DocumentSnapshot<Assistance>) => {
        this.selectedStudents = [];
        if (storedAssistance.exists) {
          this.selectedStudents = storedAssistance.data().students;
        }
        this.loading = false;
      });
  }

  saveAssistance = () => {
    this.assistance.students = this.selectedStudents;
    this.assistanceService.save(this.assistance)
      .then(() => {
        this.toastController.create({
          message: `La asistencia para el día ${moment(this.assistance.date).format('DD/MMMM/YYYY')} ha sido guardada exitosamente`,
          duration: 3000
        }).then(toast => toast.present());
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

}
