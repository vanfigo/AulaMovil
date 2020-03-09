import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ModalController, PickerController, ToastController} from '@ionic/angular';
import {Activity} from '../../../models/activity.class';
import {Student} from '../../../models/student.class';
import {StudentsService} from '../../../services/students.service';
import {Grade} from '../../../models/grade.class';
import {ActivitiesService} from '../../../services/activities.service';

@Component({
  selector: 'app-modal-activity-grades',
  templateUrl: './modal-grades.component.html',
  styleUrls: ['./modal-grades.component.scss'],
})
export class ModalGradesComponent implements OnInit {

  loading = true;
  students: Student[];
  @Input() activity: Activity;
  scoreFormGroup: FormGroup;

  constructor(public modalController: ModalController,
              private studentsService: StudentsService,
              private activitiesService: ActivitiesService,
              private toastController: ToastController,
              private pickerController: PickerController) { }

  ngOnInit() {
    this.scoreFormGroup = new FormGroup({});
    this.studentsService.findAllByGroupUid()
      .subscribe((students: Student[]) => {
        this.studentsService.students = students;
        this.students = students;
        this.students.forEach(student => {
          const grade: Grade = this.activity.grades.find(storedGrade => storedGrade.studentUid === student.uid);
          const formControl = new FormControl(grade ? grade.score : this.activitiesService.minScore);
          this.scoreFormGroup.addControl(student.uid, formControl);
        });
        this.loading = false;
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

  showScorePicker = async (student: Student) => {
    this.pickerController.create({
      columns: [{
        name: 'score',
        options: this.activitiesService.options
      }],
      buttons: [{
        text: 'Cancelar',
        role: 'cancel'
      }, {
        text: 'Seleccionar',
        handler: (value) => {
          const score: number = value.score.value;
          this.scoreFormGroup.get(student.uid).setValue(score);
          if (this.activity.grades.find(storedGrade => storedGrade.studentUid === student.uid)) {
            this.activity.grades = this.activity.grades.map(storedGrade => {
              if (storedGrade.studentUid === student.uid) {
                storedGrade.score = score;
              }
              return storedGrade;
            });
          } else {
            this.activity.grades.push({...new Grade(student.uid, score)});
          }
          this.activitiesService.update(this.activity)
            .then(() => this.toastController.create({
                message: 'La calificacion ha sido guardada exitosamente',
                duration: 3000
              }).then(toast => toast.present())
            );
        }
      }]
    }).then(picker => picker.present());
  }

}
