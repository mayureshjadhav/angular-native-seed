import { Injectable } from '@angular/core';
import { Http, RequestOptions, RequestOptionsArgs, Headers, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Rx';
// import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';

import { ErrorNotifierService } from './error-notifier';

import { environment } from './../../environments/environment';

@Injectable()
export class CustomHttpService {
    baseUrl: string = environment.apiEndpoint;

    constructor(private http: Http, private errorService: ErrorNotifierService) {
    }


    private requestMethod(url: string, options?: RequestOptionsArgs, body?: any): Observable<any> {
        const initialUrl = url;
        console.log('initial url:' + initialUrl);
        // Update the Header
        this.interceptor(url, options, body);
        url = this.baseUrl + url;
        console.log('URl :' + url);
        options.url = url;

        return this.http.request(url, options)
            .catch((err: any): any => {
                console.log('Err : ' + err);
                return this.handleError(err, initialUrl, options, body);
            })
            .finally(() => {

                console.log('Finally... :' + initialUrl);
            });
    }

    get(url: string, options?: RequestOptionsArgs): Observable<any> {
        if (options == null) {
            const headers = new Headers();
            options = new RequestOptions({
                method: RequestMethod.Get,
                headers: headers
            });
        }

        return this.requestMethod(url, options);
    }

    post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
        console.log('Before the post...');
        if (options == null) {
            const headers = new Headers();

            options = new RequestOptions({
                method: RequestMethod.Post,
                headers: headers,
                body: (body != undefined) ? body : ''
            });

        }

        console.log('Body :' + options.body);

        return this.requestMethod(url, options);
    }

    interceptor(url: string, options?: RequestOptionsArgs, body?: any) {
        // let initialUrl = url;
        const headers = options.headers || new Headers();

        headers.set('Content-Type', 'application/json');
        options.headers = headers;

        console.log('Intercept End');
    }

    handleError(err: any, initialUrl: string, options?: RequestOptionsArgs, body?: any): Observable<any> {
        const error = JSON.parse(JSON.stringify(err));

        console.log('Error Handler - ' + JSON.stringify(err));
        if (error.status === 500) {
            return Observable.throw('Server Error');
        } else if (error.status === 401) {
            console.log('CustomHttpService 401');
            // notify to controller to redirect user to login page
            this.errorService.notifyError(error);
            return Observable.empty();
        } else {
            return Observable.throw({ error: error._body, status: error.status });
        }
    }
}
