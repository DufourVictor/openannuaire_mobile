import { Injectable } from '@angular/core';
import { Angular2Csv } from 'angular2-csv';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Company } from './Model/company';
import { RetrieveCompaniesService } from "./retrieve-companies.service";
import { File } from "@ionic-native/file";
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { Platform, AlertController } from "ionic-angular";

const EXCEL_HTA = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const JSON_HTA = 'application/json;charset=UTF-8';

@Injectable()
export class ExportService {
    static CSV = 'csv';
    static JSON = 'json';
    static XLS = 'xls';

    filename = 'Export-des-données-OpenAnnuaire';
    companies: Company[];
    totalCompanies = 0;
    _url = 'https://data.opendatasoft.com/explore/dataset/sirene%40public/download/?format=';
    header = '&timezone=Europe/Berlin&use_labels_for_header=true';
    query = '';
    fileTransfer: FileTransferObject = this.transfer.create();

    constructor(
        private retrieveCompaniesService: RetrieveCompaniesService,
        private platform: Platform,
        private transfer: FileTransfer,
        private file: File,
        private alertCtrl: AlertController
    ) {
        this.retrieveCompaniesService.totalCompanies.subscribe(
            (total: number) => this.totalCompanies = total
        );
        this.retrieveCompaniesService.onQuery.subscribe(
            (query) => this.query = '&q=' + query
        );
    }

    // Go to the correct export
    export(companies: Company[] = null, format: string, allData: boolean): void {
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

    // CSV export
    exportCsv(companies: Company[]): void {
        this.companies = this.convertCompanies(companies);
        const head = [
            'Siret',
            'Nom',
            'Adresse',
            'Code postal',
            'Ville',
            'Catégorie',
            'Activité',
            'Effectif',
            'Date de création'
        ];
        const options = {
            fieldSeparator: ';',
            headers: head
        };
        if (this.platform.is('android')) {
            this.fileTransfer.download(this._url + ExportService.CSV + this.query + this.header, this.file.externalDataDirectory + this.filename + '.csv').then(
                (entry) => {
                    this.alertConfirm(entry);
                }, (error) => {
                    this.alertError(error);
                }
            );
        } else if (this.platform.is('ios')) {
            this.fileTransfer.download(this._url + ExportService.CSV + this.query + this.header, this.file.documentsDirectory + this.filename + '.csv').then(
                (entry) => {
                    this.alertConfirm(entry);
                }, (error) => {
                    this.alertError(error)
                }
            );
        } else {
            new Angular2Csv(this.companies, this.filename, options);
        }
    }

    // Excel export
    exportExcel(companies: Company[]): void {
        this.companies = this.convertCompanies(companies);
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(companies);
        const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
        const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'buffer'});
        const data: Blob = new Blob([excelBuffer], {
            type: EXCEL_HTA,
        });
        this.exportForMobile('json', data);
    }

    // Json export
    exportJson(companies: Company[]): void {
        this.companies = this.convertCompanies(companies);
        const data: Blob = new Blob([JSON.stringify(companies)], {
            type: JSON_HTA,
        });
        this.exportForMobile('json', data);
    }

    convertCompanies(companies: Company[]): [] {
        const arrayCompanies = [];
        companies.forEach(company => {
            arrayCompanies.push(company.getExportData());
        });

        return arrayCompanies;
    }

    // Mobile export
    exportForMobile(format, data): void {
        if (this.platform.is('android')) {
            this.fileTransfer.download(this._url + format + this.query + this.header, this.file.externalDataDirectory + this.filename + '.' + format).then(
                (entry) => {
                    this.alertConfirm(entry);
                }, (error) => {
                    this.alertError(error);
                }
            );
        } else if (this.platform.is('ios')) {
            this.fileTransfer.download(this._url + format + this.query + this.header, this.file.documentsDirectory + this.filename + '.' + format).then(
                (entry) => {
                    this.alertConfirm(entry);
                }, (error) => {
                    this.alertError(error);
                }
            );
        } else {
            FileSaver.saveAs(data, this.filename);
        }
    }

    // Confirmation popin
    alertConfirm(entry): void {
        const alertSuccess = this.alertCtrl.create({
            title: `Téléchargement réussi !`,
            subTitle: `Le fichier a bien été téléchargé ! Emplacement : ${entry.toURL()}`,
            buttons: ['Ok']
        });

        alertSuccess.present();
    }

    // Error popin
    alertError(error): void {
        const alertFailure = this.alertCtrl.create({
            title: `Echec du téléchargement !`,
            subTitle: `Le fichier n'a pas pu être téléchargé. Code d'erreur : ${error.code}`,
            buttons: ['Ok']
        });

        alertFailure.present();
    }
}
