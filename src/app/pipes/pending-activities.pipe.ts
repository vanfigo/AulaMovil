import {Pipe, PipeTransform} from '@angular/core';
import {ReportCard} from '../models/report-card.class';

@Pipe({
  name: 'pendingActivities'
})
export class PendingActivitiesPipe implements PipeTransform {

  transform(reportCards: ReportCard[], category: string): any {
    return category === 'pending' ?
      reportCards.filter(reportCard => reportCard.score === null) :
      reportCards.filter(reportCard => reportCard.score !== null);
  }

}
