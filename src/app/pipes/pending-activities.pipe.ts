import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'pendingActivities'
})
export class PendingActivitiesPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
