import { catchError } from 'rxjs/operators';
import { AuthenticationService } from './../authentication/authentication.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
// import { AuthService } from './auth/auth.service';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ErrorPopupComponent } from 'src/app/error-popup/error-popup.component';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService,
    private router: Router,
    public dialog: MatDialog) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      // if (err.status === 401) {
      //   this.authService.logOut();
      //   this.router.navigate(['/'])
      // }
      // console.log(err)
      const dialogRef = this.dialog.open(ErrorPopupComponent, {
        width: '250px',
        data: { errorMessage: err.error.data.message }
      });

      dialogRef.afterClosed().subscribe(result => {
        // console.log('The dialog was closed');
      });

      const error = err.error.message || err.stateText;
      return throwError(error);

    })

    );

  }
}
