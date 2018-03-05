import { Component } from '@angular/core';

import { CompaniesPage } from '../companies/companies';
import { MapPage } from '../map/map';

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
    companies: any = CompaniesPage;
    map: any = MapPage;

    constructor() {
    }
}
