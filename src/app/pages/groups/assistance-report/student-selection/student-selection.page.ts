import {Component, OnInit, ViewChild} from '@angular/core';
import {IonDatetime, LoadingController, NavController, ToastController} from '@ionic/angular';
import {Student} from '../../../../models/student.class';
import {GroupsService} from '../../../../services/groups.service';
import {ActivatedRoute} from '@angular/router';
import {StudentsService} from '../../../../services/students.service';
import {Assistance} from '../../../../models/assistance.class';
import {AssistancesService} from '../../../../services/assistances.service';
import * as papa from 'papaparse';
import * as moment from 'moment';
import {FilesService} from '../../../../services/files.service';
import {FileType} from '../../../../models/file-type.class';

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
              private toastController: ToastController,
              private assistancesService: AssistancesService,
              private filesService: FilesService) { }

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

  createAssistancesReport = () => {
    const data: any[][] = [];
    const fields: string[] = Array('Nombre del Alumno');
    this.assistancesService.findByDateRange(
      moment(this.initialDate).format(this.assistancesService.uidFormat),
      moment(this.finalDate).format(this.assistancesService.uidFormat))
      .toPromise().then((assistances: Assistance[]) => {
      const diff = moment(this.finalDate).diff(this.initialDate, 'days');
      this.students.forEach((student: Student, studentIndex: number) => {
        data[studentIndex] = [`${student.displayName} ${student.displayLastName}`, 0];
        for (let dateIndex = 0; dateIndex <= diff; dateIndex++) {
          const date = moment(this.initialDate).add(dateIndex, 'days').toDate();
          const assistanceUid = moment(date).format(this.assistancesService.uidFormat);
          if (studentIndex === 0) {
            fields.push(moment(date).format('DD/MM/YYYY'));
          }
          const assistance = assistances.find(storedAssistance => storedAssistance.uid === assistanceUid);
          if (assistance) {
            const notAssisted: boolean = !!assistance.students.find(storedStudent => storedStudent.uid === student.uid);
            data[studentIndex].splice(dateIndex + 1, 0, notAssisted ? 1 : 0);
            data[studentIndex][dateIndex + 2] += notAssisted ? 1 : 0;
          } else {
            data[studentIndex].splice(dateIndex + 1, 0, 0);
          }
        }
      });
      fields.push('Total de Faltas');
      this.filesService.generateAndShareFile(
        new FileType('Reporte de Asistencias', 'csv'),
        papa.unparse({data, fields})
      );
    });
  }

}
