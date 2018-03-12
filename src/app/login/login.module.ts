import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

// import { AppTransalateModule } from "../../shared/app-translate.module";
import { AppFontModule } from "./../shared/index";

import { LoginComponent } from "./login.component";
import { CountryCodeModal } from "./components/country-code-modal";
import { PhoneNumberProvider } from "./providers/phonenumber";

import { LoginService } from "./shared/login.service";


export const routes = [
    { path: "", component: LoginComponent },
    {
        path: "country-modal",
        component: CountryCodeModal,
        data: { title: "Country Modal" }
    }
];


@NgModule({
    schemas: [NO_ERRORS_SCHEMA],
    imports: [
        NativeScriptModule,
        NativeScriptRouterModule,
        NativeScriptFormsModule,
        NativeScriptRouterModule.forChild(routes),
        //AppTransalateModule,
        AppFontModule
    ],
    declarations: [
        LoginComponent,
        CountryCodeModal
    ],
    providers: [
        PhoneNumberProvider,
        LoginService
    ]
})
export class LoginModule {


}
