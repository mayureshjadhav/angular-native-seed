import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { NavigationExtras } from '@angular/router';

import { RouterExtensions } from 'nativescript-angular/router';

@Injectable()
export class CommonErrorService implements ErrorHandler {
    routerExtensions: RouterExtensions;

    constructor(private injector: Injector) { }

    handleError(error) {
        // do something with the exception
        console.log('Error Message : ' + error);

        const navigationExtras = {
            'error': error
        };
        this.routerExtensions = this.injector.get(RouterExtensions);
        this.routerExtensions.navigate(['error'], {
            transition: {
                name: 'slideLeft'
            },
            queryParams: navigationExtras
        });
    }
}