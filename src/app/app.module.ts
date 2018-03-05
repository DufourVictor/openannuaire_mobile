import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TagInputModule } from 'ngx-chips';
import { HttpClientModule } from '@angular/common/http';

import { CompaniesPage } from '../pages/companies/companies';
import { CompanyDetailsPage } from '../pages/company-details/company-details';
import { FiltersPage } from '../pages/filters/filters';
import { TabsPage } from '../pages/tabs/tabs';

import { RetrieveCompaniesService } from './retrieve-companies.service';
import { QueryBuilderService } from './query-builder.service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
    declarations: [
        MyApp,
        CompaniesPage,
        CompanyDetailsPage,
        FiltersPage,
        TabsPage
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        TagInputModule,
        HttpClientModule,
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        CompaniesPage,
        CompanyDetailsPage,
        FiltersPage,
        TabsPage
    ],
    providers: [
        RetrieveCompaniesService,
        QueryBuilderService,
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}
