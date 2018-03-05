import { Component, OnInit } from '@angular/core';
import { RetrieveCompaniesService } from '../../app/retrieve-companies.service';
import { Company } from '../../app/Model/company';
import { ExportService } from '../../app/export.service';

@Component({
    selector: 'page-contact',
    templateUrl: 'export.html'
})
export class ExportPage implements OnInit {
    companies: Company[];
    nhits: number;
    loaded: boolean;

    constructor(private retrieveCompaniesService: RetrieveCompaniesService, private exportService: ExportService) {
        this.retrieveCompaniesService.totalCompanies.subscribe(
            (nhits: number) => this.nhits = nhits
        );
    }

    ngOnInit(): void {
        this.retrieveCompaniesService.getCompanies();
    }

    export(format, allData) {
        if (!allData) {
            this.loaded = false;
            this.retrieveCompaniesService.loadNextCompanies(this.nhits);
            this.retrieveCompaniesService.retrieveCompanies.subscribe((companies: Company[]) => {
                if (!this.loaded) {
                    this.loaded = true;
                    this.companies = companies;
                    this.exportService.export(this.companies, format, allData);
                }
            });
        } else {
            this.exportService.export(null, format, allData);
        }
    }
}
