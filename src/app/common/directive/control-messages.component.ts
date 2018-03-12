import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { ValidationService } from './../service/validation/validation.service';

@Component({
  selector: 'control-messages',
  template: `<label *ngIf="errorMessage !== null" text="{{errorMessage}}" class="roboto-regular text-danger"></label>`
})
export class ControlMessagesComponent {
  @Input() control: FormControl;

  @Input() controlName: string;
  constructor() { }

  get errorMessage() {
    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && (this.control.dirty || this.control.touched)) {
        return ValidationService.getValidatorErrorMessage(propertyName, this.controlName, this.control.errors[propertyName]);
      }
      // if (this.control.errors.hasOwnProperty(propertyName) && this.control.dirty) {
      //   return ValidationService.getValidatorErrorMessage(propertyName, this.controlName, this.control.errors[propertyName]);
      // }
    }
    return null;
  }
}