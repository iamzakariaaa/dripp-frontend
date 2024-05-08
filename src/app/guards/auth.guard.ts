import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  
  const storageService = new StorageService();
  const router: Router = inject(Router);
  
  if (storageService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/auth']);
    return false;
  }
};
