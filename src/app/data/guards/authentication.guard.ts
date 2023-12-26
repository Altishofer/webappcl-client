import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = (route, state): boolean => {
  if (localStorage.getItem('hostName') && localStorage.getItem('hostId')) {
    if (route.url[0].path.toString() === localStorage.getItem('hostId')) {
      return true;
    } else {
      inject(Router).navigate(['host', localStorage.getItem('hostId'), 'selection']);
      return false;
    }
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
