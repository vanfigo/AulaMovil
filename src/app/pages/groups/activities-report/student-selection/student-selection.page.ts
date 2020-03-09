import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Student} from '../../../../models/student.class';
import {StudentsService} from '../../../../services/students.service';
import {GroupsService} from '../../../../services/groups.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingController, NavController} from '@ionic/angular';
import {Activity} from '../../../../models/activity.class';
import {FileType} from '../../../../models/file-type.class';
import * as papa from 'papaparse';
import {ActivitiesService} from '../../../../services/activities.service';
import {FilesService} from '../../../../services/files.service';

@Component({
  selector: 'app-student-selection',
  templateUrl: './student-selection.page.html',
  styleUrls: ['./student-selection.page.scss'],
})
export class StudentSelectionPage implements OnInit {

  loading = true;
  students: Student[];
  activities: Activity[];
  @Output() studentSelectedEvent = new EventEmitter<Student>();

  constructor(private studentsService: StudentsService,
              private activitiesService: ActivitiesService,
              private filesService: FilesService,
              private groupsService: GroupsService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private loadingController: LoadingController,
              private navController: NavController) {
    if (router.getCurrentNavigation() && router.getCurrentNavigation().extras) {
      this.activities = router.getCurrentNavigation().extras.state.activities;
    }
  }

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

  showReportCard = (student: Student) => this.navController.navigateForward(['../reportCard'], {
    state: { activities: this.activities, student },
    relativeTo: this.activatedRoute
  })

  createActivitiesReport = () => {
    const data: any[][] = [];
    const fields: string[] = Array('Nombre del Alumno');
    this.students.forEach((student: Student, studentIndex: number) => {
      data[studentIndex] = [`${student.displayName} ${student.displayLastName}`, 0];
      this.activities.forEach((activity: Activity, activityIndex: number) => {
        if (studentIndex === 0) {
          fields.push(`Actividad ${activity.position}: ${activity.name ? activity.name : 'Sin nombre'}`);
        }
        const grade = activity.grades.find(storedGrade => storedGrade.studentUid === student.uid);
        let score = this.activitiesService.minScore;
        if (grade) {
          score = grade.score;
        }
        data[studentIndex].splice(activityIndex + 1, 0, score);
        data[studentIndex][activityIndex + 2] += score;
      });
    });
    fields.push('Promedio');
    data.forEach((columns: any[]) => {
      const activitiesSize = this.activities.length;
      columns[activitiesSize + 1] = (columns[activitiesSize + 1] / activitiesSize).toFixed(2);
    });
    this.filesService.generateAndShareFile(
      new FileType('Reporte de Actividades', 'csv'),
      papa.unparse({data, fields})
    );
  }

}
