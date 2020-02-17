import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Student} from '../../../models/student.class';
import {StudentsService} from '../../../services/students.service';
import {GroupsService} from '../../../services/groups.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingController, NavController} from '@ionic/angular';
import {Activity} from '../../../models/activity.class';

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

}
