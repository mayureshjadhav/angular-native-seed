import { AppRoutingModule } from './app-routing.module';
// demo
import { HomeModule } from './home/home.module';
import { DirectiveModule } from './common/index';

export const SHARED_MODULES: any[] = [
    AppRoutingModule,
    HomeModule,
    DirectiveModule
];

export * from './app-routing.module';
