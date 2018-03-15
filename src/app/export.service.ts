import { Injectable } from '@angular/core';
import { Angular2Csv } from 'angular2-csv';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Company } from './Model/company';
import { RetrieveCompaniesService } from "./retrieve-companies.service";
import { File } from "@ionic-native/file";
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { Platform } from "ionic-angular";

const EXCEL_HTA = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const JSON_HTA = 'application/json;charset=UTF-8';

@Injectable()
export class ExportService {
    static CSV = 'csv';
    static JSON = 'json';
    static XLS = 'xls';
    filename = 'Export-des-données-OpenAnnuaire';
    companies: Company[];
    totalCompanies: number = 0;
    _url = 'https://data.opendatasoft.com/explore/dataset/sirene%40public/download/?format=';
    header = '&timezone=Europe/Berlin&use_labels_for_header=true';
    query = '';
    fileTransfer: FileTransferObject = this.transfer.create();

    constructor(
        private retrieveCompaniesService: RetrieveCompaniesService,
        private platform: Platform,
        private transfer: FileTransfer,
        private file: File
    ) {
        this.retrieveCompaniesService.retrieveCompanies.subscribe((total: number) => {
            this.totalCompanies = total;
        });
        this.retrieveCompaniesService.onQuery.subscribe((query) => {
            this.query = '&q=' + query;
        });
    }

    export(companies: Company[] = null, format: string, allData: boolean) {
        if (true === allData) {
            window.location.href = this._url + format + this.header;
        } else {
            switch (format) {
                case ExportService.CSV:
                    this.exportCsv(companies);
                    break;
                case ExportService.JSON:
                    this.exportJson(companies);
                    break;
                case ExportService.XLS:
                    this.exportExcel(companies);
                    break;
            }
        }
    }

    exportCsv(companies: Company[]) {
        this.companies = this.exportData(companies);
        const head = [
            'siren',
            'nom',
            'adresse',
            'code postal',
            'ville',
            'categorie',
            'activité',
            'effectif',
            'date de début'
        ];
        const options = {
            fieldSeparator: ';',
            headers: head
        };
        if (this.platform.is('android')) {
            this.fileTransfer.download(this._url + ExportService.CSV + this.query + this.header, this.file.externalDataDirectory + this.filename + '.csv').then((entry) => {
            }, (error) => {
                window.alert('erreur export : ' + error.message);
            });
        } else if (this.platform.is('ios')) {
            this.fileTransfer.download(this._url + ExportService.CSV + this.query + this.header, this.file.documentsDirectory + this.filename + '.csv').then((entry) => {
            }, (error) => {
                window.alert('erreur export : ' + error.message);
            });
        } else {
            new Angular2Csv(this.companies, this.filename, options);
        }
    }

    exportExcel(companies: Company[]) {
        this.companies = this.exportData(companies);
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(companies);
        const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
        const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'buffer'});
        const data: Blob = new Blob([excelBuffer], {
            type: EXCEL_HTA,
        });
        this.exportForMobile('xls', data);
    }

    exportJson(companies: Company[]) {
        this.companies = this.exportData(companies);
        const data: Blob = new Blob([JSON.stringify(companies)], {
            type: JSON_HTA,
        });
        this.exportForMobile('json', data);
    }

    exportData(companies: Company[]) {
        const arrayCompanies = [];
        companies.forEach(company => {
            arrayCompanies.push(company.getExportData());
        });

        return arrayCompanies;
    }

    exportForMobile(format, data) {
        if (this.platform.is('android')) {
            this.fileTransfer.download(this._url + format + this.query + this.header, this.file.externalDataDirectory + this.filename + '.' + format).then((entry) => {
            }, (error) => {
                window.alert('erreur export : ' + error.message);
            });
        } else if (this.platform.is('ios')) {
            this.fileTransfer.download(this._url + format + this.query + this.header, this.file.documentsDirectory + this.filename + '.' + format).then((entry) => {
            }, (error) => {
                window.alert('erreur export : ' + error.message);
            });
        } else {
            FileSaver.saveAs(data, this.filename);
        }
    }
}
