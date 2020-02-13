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

  saveGrades = () => {
    const grades: Grade[] = [];
    Object.entries(this.scoreFormGroup.value).forEach((controlValue: [string, number]) =>
      grades.push({...new Grade(controlValue[0], controlValue[1])}));
    this.activity.grades = grades;
    this.activitiesService.update(this.activity)
      .then(() => this.toastController.create({
        message: `Las calificaciones para la <strong>Actividad ${this.activity.position}: ` +
          `${this.activity.name ? this.activity.name : 'Sin nombre'}</strong> han sido actualizadas`,
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

  showScorePicker = async (student: Student) => {
    const options = [];
    for (let score = this.activitiesService.minScore; score <= this.activitiesService.maxScore; score++) {
      options.push({
        value: score,
        text: score
      });
    }
    const picker = await this.pickerController.create({
      columns: [{
        name: 'score',
        options
      }],
      buttons: [{
        text: 'Cancelar',
        role: 'cancel'
      }, {
        text: 'Seleccionar',
        handler: (value) => {
          const score: number = value.score.value;
          this.scoreFormGroup.get(student.uid).setValue(score);
        }
      }]
    });
    await picker.present();
  }

}
