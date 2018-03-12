import { NgModule, ErrorHandler } from '@angular/core';
import { Http, XHRBackend, RequestOptions } from '@angular/http';

// Shared Services
import { CustomHttpService } from './custom-http.service';
import { CommonErrorService } from './error/common-error.service';
import { ErrorNotifierService } from './error-notifier';
import { ValidationService } from './validation/validation.service';


// Added for AOT compilation
export function httpFactory(http: Http,errorNotifier: ErrorNotifierService) {
    return new CustomHttpService(http, errorNotifier);
}

@NgModule({
    imports: [],
    providers: [
        { provide: ErrorHandler, useClass: CommonErrorService },
        ErrorNotifierService,
        {
            provide: CustomHttpService,
            useFactory: httpFactory,
            deps: [Http, ErrorNotifierService]
        },
        ValidationService
    ]
})
export class CommonServiceModule { }