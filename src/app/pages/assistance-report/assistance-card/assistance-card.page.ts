import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Student} from '../../../models/student.class';
import {AssistancesService} from '../../../services/assistances.service';
import {Assistance} from '../../../models/assistance.class';
import * as moment from 'moment';
import {AssistanceCard} from '../../../models/assistance-card.class';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-assistance-card',
  templateUrl: './assistance-card.page.html',
  styleUrls: ['./assistance-card.page.scss'],
})
export class AssistanceCardPage implements OnInit {

  student: Student;
  initialDate: Date;
  finalDate: Date;
  loading = true;
  uidFormat = 'YYYYMMDD';
  notAssisted = 0;
  assistances: Assistance[];
  assistanceCards: AssistanceCard[] = [];

  constructor(private router: Router,
              private assistancesService: AssistancesService,
              private toastController: ToastController) {
    if (router.getCurrentNavigation() && router.getCurrentNavigation().extras) {
      this.student = router.getCurrentNavigation().extras.state.student;
      this.initialDate = router.getCurrentNavigation().extras.state.initialDate;
      this.finalDate = router.getCurrentNavigation().extras.state.finalDate;
      this.assistancesService.findByDateRange(
        moment(this.initialDate).format(this.uidFormat), moment(this.finalDate).format(this.uidFormat))
        .toPromise().then((assistances: Assistance[]) => {
          this.assistances = assistances;
        this.generateAssistanceCards(assistances);
      });
    }
  }

  ngOnInit() { }

  generateAssistanceCards = (assistances: Assistance[]) => {
    const diff = moment(this.finalDate).diff(this.initialDate, 'days');
    for (let i = 0; i <= diff; i++) {
      const date = moment(this.initialDate).add(i, 'days').toDate();
      const assistanceUid = moment(date).format(this.uidFormat);
      const assistance = assistances.find(storedAssistance => storedAssistance.uid === assistanceUid);
      let notAssisted: boolean;
      if (assistance) {
        notAssisted = !!assistance.students.find(storedStudent => storedStudent.uid === this.student.uid);
      } else {
        notAssisted = false;
      }
      this.assistanceCards.push(new AssistanceCard(this.student.uid, date, notAssisted));
    }
    this.updateNotAssistedCount();
  }

  updateNotAssistedCount = () => this.notAssisted = this.assistanceCards
    .reduce((sum: number, assistanceCard) => sum += assistanceCard.notAssisted ? 1 : 0, 0)

  saveAssistance = (assistanceCard: AssistanceCard, event: CustomEvent) => {
    let assistance = this.assistances.find(storedAssistance => storedAssistance.uid === assistanceCard.assistanceUid);
    if (event.detail.checked) {
      if (!assistance) {
        assistance = new Assistance(assistanceCard.date);
      }
      assistance.students.push(this.student);
    } else {
      assistance.students = assistance.students.filter(storedStudent => storedStudent.uid !== this.student.uid);
    }
    this.assistancesService.save(assistance)
      .then(() => {
        this.updateNotAssistedCount();
        this.toastController.create({
          message: `La asistencia para el dia ${moment(assistanceCard.date).format('DD/MM/YYYY')} ha sido guardada exitosamente`,
          duration: 3000
        }).then(toast => toast.present());
      });
  }

}
