import {Component, QueryList, ViewChildren} from '@angular/core';
import {Router} from '@angular/router';
import {Student} from '../../../../models/student.class';
import {AssistancesService} from '../../../../services/assistances.service';
import {Assistance} from '../../../../models/assistance.class';
import * as moment from 'moment';
import {AssistanceCard} from '../../../../models/assistance-card.class';
import {IonCheckbox, ToastController} from '@ionic/angular';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-assistance-card',
  templateUrl: './assistance-card.page.html',
  styleUrls: ['./assistance-card.page.scss'],
})
export class AssistanceCardPage {

  student: Student;
  initialDate: Date;
  finalDate: Date;
  loading = true;
  notAssisted = 0;
  assistances: Assistance[];
  assistanceCards: AssistanceCard[] = [];
  @ViewChildren(IonCheckbox) assistanceCheckbox: QueryList<IonCheckbox>;
  assistanceSub = new Subscription();

  constructor(private router: Router,
              private assistancesService: AssistancesService,
              private toastController: ToastController) {
    if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras) {
      this.student = this.router.getCurrentNavigation().extras.state.student;
      this.initialDate = this.router.getCurrentNavigation().extras.state.initialDate;
      this.finalDate = this.router.getCurrentNavigation().extras.state.finalDate;
    }
  }

  ionViewDidEnter() {
    this.assistanceSub = this.assistanceCheckbox.changes.subscribe(this.updateSelectedCheckBox);
    this.assistancesService.findByDateRange(
      moment(this.initialDate).format(this.assistancesService.uidFormat),
      moment(this.finalDate).format(this.assistancesService.uidFormat))
      .toPromise().then((assistances: Assistance[]) => {
        this.assistances = assistances;
        this.generateAssistanceCards(assistances);
        this.loading = false;
      });
  }

  ionViewWillLeave() {
    this.assistanceSub.unsubscribe();
  }

  updateSelectedCheckBox = () => this.assistanceCheckbox.forEach((checkBox: IonCheckbox) => {
    checkBox.checked = !!this.assistanceCards
      .find((assistanceCard: AssistanceCard) => checkBox.name === assistanceCard.assistanceUid)?.notAssisted;
  })

  generateAssistanceCards = (assistances: Assistance[]) => {
    const diff = moment(this.finalDate).diff(this.initialDate, 'days');
    for (let i = 0; i <= diff; i++) {
      const date = moment(this.initialDate).add(i, 'days').toDate();
      const assistanceUid = moment(date).format(this.assistancesService.uidFormat);
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
    assistanceCard.notAssisted = event.detail.checked;
    if (event.detail.checked) {
      if (!assistance) {
        assistance = new Assistance(assistanceCard.date);
      }
      assistance.students.push(this.student);
    } else {
      if (assistance) {
        assistance.students = assistance.students.filter(storedStudent => storedStudent.uid !== this.student.uid);
      }
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
