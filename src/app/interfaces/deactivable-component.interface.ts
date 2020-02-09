import {Observable} from 'rxjs';

export interface DeactivatableComponent {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
