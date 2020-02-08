import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Student} from '../../../models/student.class';
import {StudentsService} from '../../../services/students.service';
import {GroupsService} from '../../../services/groups.service';
import {IonCheckbox, IonDatetime, ToastController} from '@ionic/angular';
import {Assistance} from '../../../models/assistance.class';
import {AssistancesService} from '../../../services/assistances.service';
import * as moment from 'moment';
import {DocumentSnapshot} from '@angular/fire/firestore';

@Component({
  selector: 'app-assistance',
  templateUrl: './assistance.page.html',
  styleUrls: ['./assistance.page.scss'],
})
export class AssistancePage implements OnInit {

  loading = true;
  students: Student[];
  selectedStudents: Student[] = [];
  assistanceDate: Date;
  @ViewChildren(IonCheckbox) studentCheckbox: QueryList<IonCheckbox>;
  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  constructor(private studentsService: StudentsService,
              private groupsService: GroupsService,
              private assistanceService: AssistancesService,
              private toastController: ToastController) {
    studentsService.findAllByGroupUid().subscribe(students => {
        this.studentsService.students = students;
        this.students = students;
        this.loading = false;
      });
  }

  ngOnInit() { }

  ionViewDidEnter() {
    if (this.selectedStudents.length > 0) {
      this.selectedStudents.forEach((student: Student) => {
        this.studentCheckbox.find((checkBox: IonCheckbox) => checkBox.name === student.uid).checked = true;
      });
    }
  }

  selectStudent = (event: CustomEvent, student: Student) => {
    if (event.detail.checked) {
      this.selectedStudents.push(student);
    } else {
      this.selectedStudents = this.selectedStudents.filter((storedStudent: Student) => storedStudent.uid !== student.uid);
    }
  }

  searchAssistance = (event: IonDatetime) => {
    this.assistanceDate = new Date(event.value);
    const assistance = new Assistance(this.assistanceDate);
    this.assistanceService.findByUid(assistance.uid)
      .subscribe((storedAssistance: DocumentSnapshot<Assistance>) => {
        this.studentCheckbox.forEach(checkBox => checkBox.checked = false);
        if (storedAssistance.exists) {
          storedAssistance.data().students.forEach((student: Student) => {
            this.studentCheckbox.find((checkBox: IonCheckbox) => checkBox.name === student.uid).checked = true;
          });
        }
      });
  }

  saveAssistance = () => {
    const assistance = new Assistance(this.assistanceDate);
    assistance.students = this.selectedStudents;
    this.assistanceService.save(assistance)
      .then(() => {
        this.toastController.create({
          message: `La asistencia para el día ${moment(assistance.date).format('DD/MMMM/YYYY')} ha sido guardada exitosamente`,
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
