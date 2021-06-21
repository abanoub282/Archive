import { AuthenticationService } from './../authentication/authentication.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  if   (this.authService.currentUser.value)
      {
        // Authorised so return true
        return true;
      }

    // Not logged in so redirect to login page with the return url
    this.router.navigate(['/auth/login']);
    return false;

  }

}
