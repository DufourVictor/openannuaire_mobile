import { Component } from '@angular/core';

import { CompaniesPage } from '../companies/companies';

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
    companies: any = CompaniesPage;

    constructor() {
    }
}
