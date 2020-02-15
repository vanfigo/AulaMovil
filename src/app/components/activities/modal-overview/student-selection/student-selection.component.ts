import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Student} from '../../../../models/student.class';
import {StudentsService} from '../../../../services/students.service';

@Component({
  selector: 'app-student-selection',
  templateUrl: './student-selection.component.html',
  styleUrls: ['./student-selection.component.scss'],
})
export class StudentSelectionComponent implements OnInit {

  loading = true;
  students: Student[];
  @Output() studentSelectedEvent = new EventEmitter<Student>();

  constructor(private studentsService: StudentsService) {
    studentsService.findAllByGroupUid()
      .subscribe(students => {
        this.studentsService.students = students;
        this.students = students;
        this.loading = false;
      });
  }

  ngOnInit() { }

  filterStudents = (event: CustomEvent) => {
    const filterValue: string = event.detail.value.toLowerCase();
    if (filterValue.length > 0) {
      this.students = this.studentsService.filterStudents(filterValue);
    } else {
      this.students = [...this.studentsService.students];
    }
  }

}
