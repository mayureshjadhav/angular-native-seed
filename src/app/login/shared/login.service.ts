import { Injectable } from '@angular/core';

import { stringFormat } from '@brycemarshall/string-format';

import { CustomHttpService } from './../../common/index';

import { APIMethod } from './../../common/index';


@Injectable()
export class LoginService {
    constructor(private http: CustomHttpService) { }

    LocationValidation(locationCode: string) {
        const url = stringFormat(APIMethod.LOCATION_VALIDATION, locationCode);
        return this.http.get(url);
    }

    MobileSelfRegistration(mobileNumber: string) {
        const url = stringFormat(APIMethod.MOBILE_SELFREGISTRATION, mobileNumber);
        return this.http.get(url);
    }

    ValidateMobileSelfRegistration(mobileNumber: string, activationCode: string, locationId: number) {
        const url = stringFormat(APIMethod.VALIDATE_MOBILE_REG, mobileNumber, activationCode, locationId);
        return this.http.get(url);
    }
}

