import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

// This is an HTTP interceptor. It will be used as an error interceptor to handle errors in the FE
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  // router will be used to redirect the user to the corresponding page based on the error type
  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // next is the next middleware (like in express)
    return next.handle(request).pipe(
      catchError(error => {
        if (error) {
          switch (error.status) {
            case 400:
              const errorsArray = error.error.errors;
              // depending on the type of 400 error, we could get an array of errors
              if (errorsArray) {
                // array of strings that describe each error returned by the API in the errors array
                const modalStateErrors = [];
                for (const key in errorsArray) {
                  if (errorsArray[key]) {
                    modalStateErrors.push(errorsArray[key]);
                  }
                }
                throw modalStateErrors.flat();
              } else {
                this.toastr.error(error.statusText, error.status);
              }
              break;
            case 401:
              this.toastr.error(error.statusText, error.status);
              break;
            case 404: 
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras: NavigationExtras = { state: {error: error.error}}
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;
            default:
              this.toastr.error('Something unexpected went wrong');
              console.log(error);
              break;
          }
        }
        return throwError(error);
      })
    );
  }
}
