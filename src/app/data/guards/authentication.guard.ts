import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {HostService} from "@data/services/host.service";

export const authenticationGuard: CanActivateFn = (route, state): boolean => {
  if (localStorage.getItem('hostName') && localStorage.getItem('hostId')) {
    return true;
  } else {
    inject(Router).navigate(['login']);
    return false;
  }
};

export const loggedInGuard: CanActivateFn = (route, state): boolean => {
  if (!localStorage.getItem('hostName') || !localStorage.getItem('hostId')) {
    return true;
  } else {
    inject(Router).navigate(['host', localStorage.getItem('hostId'), 'selection'])
    return false;
  }
};
