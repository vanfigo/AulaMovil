import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Student} from '../../../models/student.class';
import {StudentsService} from '../../../services/students.service';
import {GroupsService} from '../../../services/groups.service';
import {AlertController, IonCheckbox, IonDatetime, ToastController} from '@ionic/angular';

@Component({
  selector: 'app-assistance',
  templateUrl: './assistance.page.html',
  styleUrls: ['./assistance.page.scss'],
})
export class AssistancePage implements OnInit {

  loading = false;
  students: Student[];
  filteredStudents: Student[];
  selectedStudents: Student[] = [];
  @ViewChildren(IonCheckbox) checkBox: QueryList<IonCheckbox>;

  constructor(private studentsService: StudentsService,
              private groupsService: GroupsService,
              private alertController: AlertController,
              private toastController: ToastController) {
    studentsService.findAllByGroupUid(groupsService.group.uid)
      .subscribe(students => {
        this.students = students;
        this.loading = false;
      });
  }

  ngOnInit() { }

  searchAssistance = (event: IonDatetime) => {
    const date = event.value;
  }

  selectStudent = (event: CustomEvent, student: Student) => {
    if (event.detail.checked) {
      this.selectedStudents.push(student);
    } else {
      this.selectedStudents = this.selectedStudents.filter((storedStudent: Student) => storedStudent.uid !== student.uid);
    }
  }

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

}
