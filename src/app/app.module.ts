import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TagInputModule } from 'ngx-chips';
import { HttpClientModule } from '@angular/common/http';

import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Network } from '@ionic-native/network';

import { CompaniesPage } from '../pages/companies/companies';
import { CompanyDetailsPage } from '../pages/company-details/company-details';
import { FiltersPage } from '../pages/filters/filters';
import { MenuPage } from '../pages/menu/menu';
import { MapPage } from '../pages/map/map';
import { ExportPage } from '../pages/export/export';
import { TabsPage } from '../pages/tabs/tabs';

import { RetrieveCompaniesService } from './retrieve-companies.service';
import { QueryBuilderService } from './query-builder.service';
import { ExportService } from './export.service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeFr, 'fr');
@NgModule({
    declarations: [
        MyApp,
        CompaniesPage,
        CompanyDetailsPage,
        FiltersPage,
        MenuPage,
        MapPage,
        ExportPage,
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
        MenuPage,
        MapPage,
        ExportPage,
        TabsPage
    ],
    providers: [
        RetrieveCompaniesService,
        QueryBuilderService,
        ExportService,
        StatusBar,
        SplashScreen,
        File,
        FileTransfer,
        Network,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}
