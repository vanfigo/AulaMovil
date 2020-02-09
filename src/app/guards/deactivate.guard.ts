import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {DeactivatableComponent} from '../interfaces/deactivable-component.interface';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable()
export class DeactivateGuard implements CanDeactivate<DeactivatableComponent> {
  canDeactivate(component: DeactivatableComponent,
                currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot,
                nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
