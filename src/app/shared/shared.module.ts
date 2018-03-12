import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
    imports: [CommonModule,
        ModalModule.forRoot()],
    declarations: [],
    exports: [
        CommonModule,
        FormsModule,
        ModalModule
    ]
})
export class SharedModule { };
