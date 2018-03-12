import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { isAndroid } from 'platform';

import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';

import { PhoneNumberProvider } from '../providers/phonenumber';

// child component containing contact search modal
@Component({
    template: `
    <StackLayout backgroundColor="white">
      <GridLayout rows="auto" columns="50 * 50" class="header">
        <Label text="Select Country" col="1" class="center header-text"></Label>
        <Label [text]="'fa-times' | fonticon" col="2" class="fa header-text close-button" (tap)="params.closeCallback(null)"></Label>
      </GridLayout>
      <SearchBar #searchBar hint="Search" (textChange)="searchCountryCode($event)"></SearchBar>
      <ListView [items]="countriesFound" style="margin:10;">
        <ng-template let-item="item">
          <!-- template wrapped in StackLayout for class list-item to take effect -->
          <StackLayout>
            <GridLayout columns="40 *" rows="auto,auto" (tap)="selectCountry(item)" class="list-item">
              <Image *ngIf="item.flag" [src]="'data:image/png;base64,'+item.flag" row="0" col="0" class="flag"></Image>
              <Label [text]="item.name" row="0" col="1" class="country-name"></Label>
              <Label [text]="'+'+item.dialCode" row="1" col="1" class="country-dialcode"></Label>
            </GridLayout>
          </StackLayout>
        </ng-template>
      </ListView>
    </StackLayout>
  `,
  styles: [`
    .header { background-color:#0d88ff; padding-top:10; padding-bottom:10; }
    .header-text { color:white; font-size: 22; vertical-align:center; }
    .close-button { width:30; }
    .list-item { margin-top:10; }
    .flag { border-radius: 10; width:30; }
    .country-name { color:black; }
    .country-dialcode { margin-top:5; color:#999999; }
  `]
})
export class CountryCodeModal implements OnInit {
    @ViewChild('searchBar') searchBar: ElementRef; // get reference to search bar

    public countriesFound: Array<any> = [];

    constructor(private params: ModalDialogParams, public phonenumber: PhoneNumberProvider,
        private fonticon: TNSFontIconService) { }

    ngOnInit() {
        this.countriesFound = this.phonenumber.countries;
    }

    public searchCountryCode(event) {
        setTimeout(() => {
        console.log('Search Text : ' + event.value)
        let regex = new RegExp(event.value, 'i');
        this.countriesFound = this.phonenumber.countries.filter((country) => regex.test(country.name));
        });
    }

    public selectCountry(country) {
        this.params.closeCallback({ iso2: country.iso2, dialCode: country.dialCode });
    }
}