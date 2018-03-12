import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';


@Injectable()
export class CommonErrorService implements ErrorHandler {
    routerExtensions: Router;

    constructor(private injector: Injector) { }

    handleError(error) {
        // do something with the exception
        console.log('Error Message : ' + error);

        const navigationExtras = {
            'error': error
        };
        this.routerExtensions = this.injector.get(Router);
        this.routerExtensions.navigate(['error'], {
            queryParams: navigationExtras
        });
    }
}