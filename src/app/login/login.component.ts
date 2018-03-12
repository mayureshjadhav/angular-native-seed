import { Component, OnInit, AfterContentInit, OnDestroy, ViewChild, ElementRef, ViewContainerRef } from "@angular/core";

import { alert } from "ui/dialogs";
import { Page } from "ui/page";
import { isAndroid } from "platform";

import { RouterExtensions } from "nativescript-angular/router";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";

//import { TranslateService } from "ng2-translate";
import { TNSFontIconService } from "nativescript-ngx-fonticon";
import * as Toast from "nativescript-toasts";
import { Telephony } from 'nativescript-telephony';

//import { AuthProvider } from "../providers/auth"
import { CountryCodeModal } from './components/country-code-modal';
import { PhoneNumberProvider } from './providers/phonenumber';

import { LoginService } from './shared/login.service';
import { ErrorNotifierService } from './../common/index';
//import { SnackbarMessageService } from '../../core/snackbar-message.service';

var android: any;

@Component({
    selector: 'login',
    moduleId: module.id,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, AfterContentInit, OnDestroy {

    isLoading = false;
    renderView = true;
    renderViewTimeout: any;

    @ViewChild('phoneField') phoneField: ElementRef; // get reference to phoneField    
    private showLocationStep: boolean = true;
    private showRegistrationStep: boolean = false;
    private showVerificationStep: boolean = false;
    private countryCode: string; // ISO 2 char country code (e.g. US)
    private countryDialCode: string; // country dial code (e.g. 1)
    private phoneNumber: string = ''; // country local phone number entry from user
    private location: string = ''; // location
    private locationId: number = null; // location Id
    private verificationCode: string = ''; // verification code entry from user    
    private flagImage: any;  // base64 encoded flag image currently displayed in form
    private spinner: boolean = false; // whether to show the activity indicator

    constructor(private routerExtensions: RouterExtensions, private page: Page,
        private fonticon: TNSFontIconService, private errorNotifier: ErrorNotifierService,
        private loginService: LoginService,
        private phoneNumberProvider: PhoneNumberProvider, private modal: ModalDialogService, private vcRef: ViewContainerRef) {
        page.actionBarHidden = true;

        // Handle Error
        this.errorHandler();
    }

    ngAfterContentInit() {
        this.renderViewTimeout = setTimeout(() => {
            this.renderView = false;

        }, 300);
    }

    ngOnDestroy() {
        clearTimeout(this.renderViewTimeout);
    }

    public ngOnInit() {
        setTimeout(() => {
            Telephony().then((info) => {
                console.log('Country : ' + JSON.stringify(info));
                if (info.hasOwnProperty('countryCode')) {
                    this.countryCode = info['countryCode'] || 'us';
                    this.countryDialCode = this.phoneNumberProvider.countries.find((c) => c['iso2'] == this.countryCode)['dialCode'];
                    this.setFlagImage();
                }
            }, (error) => {
                console.log('Error : ' + JSON.stringify(error));
                console.log('Unable to retrieve SIM info');
                // default to US
                this.countryCode = 'us';
                this.countryDialCode = '1';
                this.setFlagImage();
            });
        });

    }

    // loading the view
    public isLoadingView(flag: boolean) {
        console.log('Flag : ' + flag);
        this.isLoading = flag;
    }

    errorHandler() {
        this.errorNotifier.onError(err => {
            console.log('Handle Error ' + JSON.stringify(err));
            // hide Loading
            this.isLoadingView(false);
            if (err.status === 401) {
                alert('Not Authorized');
                //this.snackbarService.info('Not Authorized');
                // this.routerExtensions.navigate(["login"], {
                //     transition: {
                //         name: "slideLeft"
                //     },
                //     clearHistory: true
                // });
            } else {
                //this.snackbarService.info(err);
                alert(err);
            }
        });
    }

    // On Location Next Tab
    private doSelectLocation() {
        console.log('Location : ' + this.location);

        if (this.location === undefined || this.location === '') {
            this.showToast('Please enter a location');

        } else {
            this.isLoadingView(true);
            this.loginService.LocationValidation(this.location).subscribe((response) => {
                var res = response._body;
                console.log('Location Details : ' + JSON.stringify(res));
                this.locationId = res.lid;

                // Show Mobile registration form
                this.showLocationStep = false;
                this.showRegistrationStep = true;
                this.showVerificationStep = false;

                // hide Loading
                this.isLoadingView(false);

            },
                (error) => {
                    // Hide Loading
                    this.isLoadingView(false);
                    this.showToast('Location not found');
                });
        }
    }

    // On Mobile Registration Next Tab
    private doRegister() {
        if (!this.validateNumber()) { this.showToast('Please enter a valid mobile phone number!');  }

        // show Loading
        this.isLoadingView(true);
        this.loginService.MobileSelfRegistration(this.countryDialCode + this.phoneNumber).subscribe((response) => {
            // Show mobile verification form
            this.showLocationStep = false;
            this.showRegistrationStep = false;
            this.showVerificationStep = true;

            // hide Loading
            this.isLoadingView(false);

        },
            (error) => {
                console.log('Mobile Reg Error : ' + error);
                // Hide Loading
                this.isLoadingView(false);
                this.showToast('Please enter valid mobile phone number');
            });

    }

    // On Verify Tab
    private doVerifyCode() {
        if (this.verificationCode === undefined || this.verificationCode === '') {
            this.showToast('Please enter verification code');

        } else {
            // Show Loading
            this.isLoadingView(true);
            this.loginService.ValidateMobileSelfRegistration(this.countryDialCode + this.phoneNumber, this.verificationCode, this.locationId)
            .subscribe((response) => {
                // hide Loading
                this.isLoadingView(false);

                // show success
                alert('You have successfully registered with us.');
            },
                (error) => {
                    // Hide Loading
                    this.isLoadingView(false);
                    this.showToast('Please enter valid verification code');
                });
        }
    }


    private validateNumber(): boolean {
        return this.phoneNumberProvider.isValidMobile(this.username(), this.countryCode);
    }

    /* in this example the phonenumber in E164 format is used as username */
    private username(): string {
        let _phoneNumber = (this.phoneNumber === undefined) ? '' : this.phoneNumber.replace(/^(\(0\)|0)/, '');
        return this.countryDialCode + _phoneNumber;
    }

    private handleLeadingZero(event) {
        this.phoneNumber = event.value.replace(/^0/, '(0)');

        /*
           Valid for NativeScript 2.4 the cursor remains at beginning of TextField
           after changing the value on Android so need to manually put it at the end
        */
        if (isAndroid) {
            setTimeout(() => {
                this.phoneField.nativeElement.android.setSelection(this.phoneField.nativeElement.text.length);
                //this.phoneField.nativeElement.android.setSelection( this.phoneField.nativeElement.android.length() );
            }, 0);
        }
    }

    /* update the flag to show in the UI according to the currently set country */
    private setFlagImage() {
        let country = this.phoneNumberProvider.countries.find((c) => { return c.iso2 == this.countryCode; });
        this.flagImage = (country && country.hasOwnProperty('flag') && country.flag !== null) ? country.flag : null;
    }

    private showCountryCodeModal() {
        let modalOptions = {
            viewContainerRef: this.vcRef,
            context: {}, // data to pass to modal in params
            fullscreen: true
        };

        this.modal.showModal(CountryCodeModal, modalOptions).then((result) => {
            //console.dump(result);
            if (result && result.hasOwnProperty('iso2') && result.hasOwnProperty('dialCode')) {
                this.countryCode = result['iso2'];
                this.countryDialCode = result['dialCode'];
                this.setFlagImage();
            }
        });
    }

    private showToast(message: string) {
        Toast.show({
            text: message,
            duration: Toast.DURATION.SHORT
        });
    }
}