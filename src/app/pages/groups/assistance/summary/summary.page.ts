import {Component, ViewChild} from '@angular/core';
import {ChartDataSets, ChartOptions} from 'chart.js';
import {Label} from 'ng2-charts';
import {IonSegment, ToastController} from '@ionic/angular';
import {AssistancesService} from '../../../../services/assistances.service';
import * as moment from 'moment';
import {Assistance} from '../../../../models/assistance.class';
import {Plugins} from '@capacitor/core';
import {GroupsService} from '../../../../services/groups.service';

const { Clipboard } = Plugins;

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage {

  @ViewChild(IonSegment, {static: true}) timeLapseSegment: IonSegment;
  timeLapse = 'last';
  loading: boolean;
  assistances: Assistance[];
  barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {
          stepSize: 1,
          beginAtZero: true
        }
      }]
    },
    layout: {
      padding: {
        top: 20,
        left: 20,
        right: 20,
        bottom: 120
      }
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  barChartColors = [{ backgroundColor: '#2e86de' }];
  barChartLegend = false;
  barChartLabels: Label[] = [];
  barChartData: ChartDataSets[] = [{}];

  constructor(private assistancesService: AssistancesService,
              private toastController: ToastController,
              private groupsService: GroupsService) {
  }

  ionViewDidEnter() {
    this.timeLapseSegment.value = this.timeLapse;
  }

  findAssistances = (dates: string[]) => this.assistancesService.findInDatesArray(dates)
    .subscribe((assistances: Assistance[]) => {
      this.loading = false;
      this.assistances = assistances;
      this.barChartLabels = dates.map(date => moment(date).locale('es').format('dd DD, MMM'));
      this.barChartData = [{
        data: dates.map(date => {
          const assistanceFound = assistances.find(assistance => assistance.uid === date);
          return assistanceFound ? assistanceFound.students.length : 0;
        }),
        barThickness: 40
      }];
  })

  showAssistance = (event: CustomEvent) => {
    this.loading = true;
    this.timeLapse = event.detail.value;
    switch (this.timeLapse) {
      case 'last':
        this.findAssistances(this.getDates(1));
        break;
      case '3daysBack':
        this.findAssistances(this.getDates(3));
        break;
      case '5daysBack':
        this.findAssistances(this.getDates(5));
        break;
    }
  }

  getDates = (elements: number): string[] => {
    const filterDates: string[] = [];
    const currentDate = moment();
    while (filterDates.length < elements) {
      if (currentDate.day() > 0 && currentDate.day() < 6) {
        filterDates.push(currentDate.format(this.assistancesService.uidFormat));
      }
      currentDate.subtract(1, 'day');
    }
    return filterDates.sort();
  }

  copyCurrentAssistances = () => {
    const description = `Inasistencias Grupo ${this.groupsService.group.name}:` + this.assistances.map(assistance => {
      const date = '\r\n' + moment(assistance.uid).locale('es').format('dddd DD [de] MMMM, YYYY') + '\r\n';
      const students = assistance.students.map(student => `${student.displayName} ${student.displayLastName}`);
      return date + students.join('\r\n');
    }).join('');
    Clipboard.write({
      string: description
    }).then(() => {
      this.toastController.create({
        message: 'Las asistencias han sido copiadas al portapapeles exitosamente',
        duration: 3000
      }).then(toast => toast.present());
    });
  }

}
