import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { ApiInterface } from './Model/api-interface';
import { CompanyInterface } from './Model/company-interface';
import { Company } from './Model/company';
import { QueryBuilderService } from './query-builder.service';
import { Filter } from './Model/filter';
import { Loading, LoadingController } from 'ionic-angular';

@Injectable()
export class RetrieveCompaniesService {
    static DATASET = 'sirene';
    static LANG = 'fr';
    static MAX_ROWS = 10000;
    static DEFAULT_ROWS = 100;

    private url = 'https://public.opendatasoft.com/api/records/1.0/search/';
    companies: Company[] = [];
    retrieveCompanies = new EventEmitter();
    filterCompanies = new EventEmitter();
    totalCompanies = new EventEmitter();
    facetCompanies = new EventEmitter();
    facetGroupsCompanies = new EventEmitter();
    onQuery = new EventEmitter();

    filters: Filter[] = [];
    start: number = 0;
    nhits: number = 0;
    rows: number = 100;
    loading: Loading;
    facets: string[] = [];
    facetGroups = {};

    constructor(private http: HttpClient, private query: QueryBuilderService, public loadingCtrl: LoadingController) {
        this.filterCompanies.subscribe((filter: Filter) => {
            if (!this.filters.some(x => x === filter)) {
                this.filters.push(filter);
            }
        });

        this.facetCompanies.subscribe((facet: string) => {
            if (!this.facets.some(x => x === facet)) {
                this.facets.push(facet);
            }
            this.reloadCompanies(true);
        });
    }

    dispatchEvents() {
        this.totalCompanies.emit(this.nhits);
        this.facetGroupsCompanies.emit(this.facetGroups);
        this.retrieveCompanies.emit(this.companies as Company[]);
        this.loading.dismissAll();
    }

    getCompanies() {
        this.createLoader();
        this.onQuery.emit(this.query.queryBuilder(this.filters));
        return this.http.get(this.url, {
            params: {
                dataset: RetrieveCompaniesService.DATASET,
                lang: RetrieveCompaniesService.LANG,
                rows: this.rows.toString(),
                facet: this.facets,
                start: this.start.toString(),
                q: this.query.queryBuilder(this.filters),
            },
        }).map(
            (res) => res as ApiInterface).subscribe(
            (response: ApiInterface) => {
                this.nhits = response.nhits;
                this.facetGroups = response.facet_groups;
                response.records.forEach((record: CompanyInterface) => {
                    this.companies.push(new Company(
                        record.fields.siren,
                        record.fields.l1_normalisee,
                        record.fields.l4_normalisee,
                        record.fields.codpos,
                        record.fields.libcom,
                        record.fields.categorie,
                        record.fields.libapen,
                        record.fields.libtefet,
                        record.fields.dcret,
                        record.fields.coordonnees,
                    ));
                });

                this.dispatchEvents();
            }
        );
    }

    reloadCompanies(reload: boolean = false, number: number = 0) {
        if (reload) {
            this.companies = [];
            this.start = 0;

            if (number !== 0) {
                this.rows = number;
            } else {
                this.rows = RetrieveCompaniesService.DEFAULT_ROWS;
            }

            return this.getCompanies();
        }

        this.dispatchEvents();
    }

    createLoader(): void {
        this.loading = this.loadingCtrl.create({
            spinner: 'dots',
            content: 'Chargement en cours...',
        });
        this.loading.present();
    }

    loadNextCompanies(rows: number = null) {
        if (null !== rows) {
            if (RetrieveCompaniesService.MAX_ROWS <= rows) {
                rows = RetrieveCompaniesService.MAX_ROWS;
                this.start = 0;
            }
            this.rows = rows;
            this.companies = [];
        } else {
            if (this.rows !== RetrieveCompaniesService.MAX_ROWS) {
                this.start += this.rows;
            } else {
                this.start = 0;
            }
        }

        return this.getCompanies();
    }
}
