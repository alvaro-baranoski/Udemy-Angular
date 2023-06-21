import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  return inject(AuthService).user.pipe(take(1), map(user => {
    const isAuth = !!user;
    if (isAuth)
      return true;
    return inject(Router).createUrlTree(["/auth"]);
  }));
};
