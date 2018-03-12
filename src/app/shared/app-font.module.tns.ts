import { NgModule, NO_ERRORS_SCHEMA, ModuleWithProviders } from "@angular/core";

// import { NativeScriptModule } from "nativescript-angular/nativescript.module";
// import { NativeScriptHttpModule } from "nativescript-angular/http";

import { TNSFontIconModule } from "nativescript-ngx-fonticon";

@NgModule({
    schemas: [NO_ERRORS_SCHEMA],
    imports: [
        // NativeScriptModule,
        TNSFontIconModule
    ],
    exports: [
        TNSFontIconModule]
})
export class AppFontModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AppFontModule
        };
    }

}
