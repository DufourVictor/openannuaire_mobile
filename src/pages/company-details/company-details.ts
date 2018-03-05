import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Company } from "../../app/Model/company";

declare let google: any;

@Component({
    selector: 'page-company-details',
    templateUrl: 'company-details.html',
})
export class CompanyDetailsPage {
    company: Company;
    isLocalized = false;
    @ViewChild('map_detail_companies') mapRef: ElementRef;

    constructor(public navParams: NavParams) {
        this.company = navParams.data;
    }

    ionViewDidLoad() {
        this.displayMap();
    }

    // Display map
    displayMap() {
        if (undefined !== this.company.coordonnees) {
            this.isLocalized = true;
            const destination = new google.maps.LatLng(this.company.coordonnees[0], this.company.coordonnees[1]);

            //Map options
            const options = {
                center: destination,
                zoom: 5,
                streetViewControl: false,
                disableDefaultUI: true
            };

            // Display map
            const map = new google.maps.Map(this.mapRef.nativeElement, options);

            this.addMarker(destination, map, this.company.name);
        }
    }

    // Display marker
    addMarker(position, map, title) {
        return new google.maps.Marker({
            position,
            map,
            title
        });
    }
}
