import { CatalogueResultsComponent } from './catalogue-results/catalogue-results.component';
import { MapService } from './../shared/map/map.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger,transition, animate, style } from '@angular/animations';
import { ThemePalette, MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { CatalogueSearchComponent } from './catalogue-search/catalogue-search.component';

@Component({
  selector: 'app-catalogue-browser',
  templateUrl: './catalogue-browser.component.html',
  styleUrls: ['./catalogue-browser.component.scss'],
  animations: [
    trigger('rotateIcon', [
      transition('closed => open', animate(300, style({ transform: 'rotate(360deg)' }))),
      transition('open => closed', animate(300, style({ transform: 'rotate(-360deg)' })))
    ])
  ],
  providers: [MapService]
})
export class CatalogueBrowserComponent implements OnInit {
  
  @ViewChild('cataloguetabs') catalogueTabs;
  @ViewChild(CatalogueResultsComponent) resultsComponent;
  progressLoading = false;
  searchResults: number;
  valueBasemap: string = "oceans";

  constructor(private mapService: MapService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) { 
    iconRegistry.addSvgIcon('more-zoom', sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/more-zoom.svg'));
    iconRegistry.addSvgIcon('less-zoom', sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/less-zoom.svg'));
  }

  ngOnInit() {
  }

  onClickSatellite() {
    this.valueBasemap = "satellite";
    this.reloadMap(this.valueBasemap);
  }

  onClickBathymetry() {
    this.valueBasemap = "oceans";
    this.reloadMap(this.valueBasemap);
  }

  private reloadMap(basemap: string) {
    this.mapService.createMap('map');
    this.mapService.addBasemap(basemap);
  }

}
