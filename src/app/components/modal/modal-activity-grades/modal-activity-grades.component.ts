import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalController, ToastController} from '@ionic/angular';
import {Activity} from '../../../models/activity.class';
import {Student} from '../../../models/student.class';
import {StudentsService} from '../../../services/students.service';
import {Grade} from '../../../models/grade.class';
import {ActivitiesService} from '../../../services/activities.service';

@Component({
  selector: 'app-modal-activity-grades',
  templateUrl: './modal-activity-grades.component.html',
  styleUrls: ['./modal-activity-grades.component.scss'],
})
export class ModalActivityGradesComponent implements OnInit {

  loading = true;
  students: Student[];
  @Input() activity: Activity;
  scoreFormGroup: FormGroup;
  toolbarErrorText: string;

  constructor(public modalController: ModalController,
              private studentsService: StudentsService,
              private activitiesService: ActivitiesService,
              private toastController: ToastController) { }

  ngOnInit() {
    this.scoreFormGroup = new FormGroup({});
    this.studentsService.findAllByGroupUid()
      .subscribe((students: Student[]) => {
        this.studentsService.students = students;
        this.students = students;
        this.students.forEach(student => {
          const grade: Grade = this.activity.grades.find(storedGrade => storedGrade.studentUid === student.uid);
          const formControl = new FormControl(grade ? grade.score : 5, [
            Validators.required, Validators.min(this.activity.minScore), Validators.max(10)
          ]);
          this.scoreFormGroup.addControl(student.uid, formControl);
        });
        this.loading = false;
      });
  }

  saveGrades = () => {
    const grades: Grade[] = [];
    Object.entries(this.scoreFormGroup.value).forEach((controlValue: [string, number]) =>
      grades.push({...new Grade(controlValue[0], controlValue[1])}));
    this.activity.grades = grades;
    this.activitiesService.update(this.activity)
      .then(() => this.toastController.create({
        message: `Las calificaciones para la <strong>Actividad ${this.activity.position}: ${this.activity.name}</strong>` +
          ' han sido actualizadas',
        duration: 3000
      }).then(toast => {
        toast.present();
        this.modalController.dismiss();
      })
    );
  }

  filterStudents = (event: CustomEvent) => {
    const filterValue: string = event.detail.value.toLowerCase();
    if (filterValue.length > 0) {
      this.students = this.studentsService.filterStudents(filterValue);
    } else {
      this.students = [...this.studentsService.students];
    }
  }

  updateErrorToolbar = (uid: string) => {
    let errorText = '';
    Object.values(this.scoreFormGroup.controls).some(formControl => {
      if (formControl.errors) {
        if (formControl.errors.required) {
          errorText = 'Este campo es requerido';
        } else if (formControl.errors.min) {
          errorText = `El valor mínimo es ${this.activity.minScore}`;
        } else if (formControl.errors.max) {
          errorText = `El valor máximo es 10`;
        }
      } else {
        errorText = '';
      }
      return errorText.length > 0;
    });
    this.toolbarErrorText = errorText;
  }

}
