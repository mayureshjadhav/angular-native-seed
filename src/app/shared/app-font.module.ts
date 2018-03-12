import { NgModule, NO_ERRORS_SCHEMA, ModuleWithProviders } from "@angular/core";

// import { NativeScriptModule } from "nativescript-angular/nativescript.module";
// import { NativeScriptHttpModule } from "nativescript-angular/http";

import { AngularFontAwesomeModule } from "angular-font-awesome";

@NgModule({
    schemas: [NO_ERRORS_SCHEMA],
    imports: [
        // NativeScriptModule,
        AngularFontAwesomeModule
    ],
    exports: [
        AngularFontAwesomeModule]
})
export class AppFontModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AppFontModule
        };
    }

}
