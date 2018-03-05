import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RetrieveCompaniesService } from '../../app/retrieve-companies.service';
import { Company } from '../../app/Model/company';
import { CompanyDetailsPage } from "../company-details/company-details";

@Component({
    selector: 'page-companies',
    templateUrl: 'companies.html'
})
export class CompaniesPage implements OnInit {
    companies: Company[];

    constructor(public navCtrl: NavController, private retrieveCompaniesService: RetrieveCompaniesService) {
        this.retrieveCompaniesService.retrieveCompanies.subscribe(
            (companies: Company[]) => this.companies = companies
        );
    }

    ngOnInit(): void {
        this.retrieveCompaniesService.getCompanies();
    }

    doInfinite(infiniteScroll) {
        setTimeout(() => {
            this.retrieveCompaniesService.loadNextCompanies();
            infiniteScroll.complete();
        }, 700);
    }

    openCompanyDetails(company: Company) {
        this.navCtrl.push(CompanyDetailsPage, company);
    }
}
