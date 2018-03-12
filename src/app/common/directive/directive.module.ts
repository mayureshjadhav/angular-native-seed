import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { ControlMessagesComponent  } from './control-messages.component';

@NgModule({
    schemas: [NO_ERRORS_SCHEMA],
    imports: [],
    declarations: [ControlMessagesComponent],
    exports: [ControlMessagesComponent]
})
export class DirectiveModule { }