import { LatLng } from './lat-lng-coordinates';
import { MapService } from './../../shared/map/map.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FileNode, FileFlatNode } from './../catalogue-results/catalogue-results.component';
import { DatasetDetail } from './../shared/models/dataset-detail.model';
import { Search } from './../shared/models/search.model';
import { CatalogueSimoceanService } from './../shared/services/catalogue-simocean.service';
import { DatasetList } from './../shared/models/dataset-list.model';
import { Observable } from 'rxjs';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTreeFlatDataSource, MatIconRegistry } from '@angular/material';

@Component({
  selector: 'app-catalogue-search',
  templateUrl: './catalogue-search.component.html',
  styleUrls: ['./catalogue-search.component.scss']
})
export class CatalogueSearchComponent implements OnInit, AfterViewInit {
  
  selectedCampain: string;
  campains: Observable<DatasetList>;
  startDate : Date;
  endDate : Date;
  errorMessage : string = "";
  dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;
  isLocationExpanded = false;
  isDrawingEnabled = false;
  boundingBox: LatLng[];
  
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, 
              private simoceanService: CatalogueSimoceanService, private mapService: MapService) {
    iconRegistry.addSvgIcon('rectangle-draw', sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/rectangle-draw.svg'));
    this.boundingBox = this.loadFilterFromStorage('bbox');
  }

  ngOnInit() {
    this.getCampainsList();
  }

  ngAfterViewInit() {
    // We call this method so that the bounding box stored in the session
    // storage is automatically added to the map
    this.addBBoxToMap();
    //this.setupMapServiceEvents();
  }

  onChangeCampains(value) {
    this.selectedCampain = value;
  }

  /**
   * Checks if the session storage has an item that matches the given filter name
   * and returns the parsed value if so.
   *
   * @param filterName The name of the filter to load from the storage
   */
  loadFilterFromStorage(filterName: string) {
    if (sessionStorage.getItem(filterName) !== null && sessionStorage.getItem(filterName) !== 'undefined') {
      return JSON.parse(sessionStorage.getItem(filterName));
    }
  }

  /**
   * Adds a bounding box to the map
   */
  addBBoxToMap() {
    console.log('addBoundingBox !!!!!!!!!!!!!!!!!!');
    if (this.boundingBox) {
      this.mapService.addPolygonLayer('temp', this.boundingBox, true, '#76FF03');
    }
  }

  /**
   * Adds drawing events to the map service for drawing purposes
   */
  setupMapServiceEvents() {
    // When the user ends drawing, set the bounding box coordinates
    this.mapService.addDrawEvent('editable:drawing:commit', shape => {
      // We need to check if the polygon is valid for a search: it must have more than
      // 2 points
      if (this.setBboxFromShape(shape.layer._latlngs[0])) {
        this.mapService.removeLeafletLayerFromMap(shape.layer);
        this.mapService.addPolygonLayer('temp', this.boundingBox, true, '#76FF03');
      }
      this.isDrawingEnabled = false;
      this.mapService.updateTooltip(false);
    });

    // When the user starts drawing, the previously drawn layer is removed
    this.mapService.addDrawEvent('editable:drawing:start', () => {
      this.mapService.removeLayerFromMap('temp');
    });

    // When the user starts drawing, the previously drawn layer is removed
    this.mapService.addDrawEvent('editable:vertex:dragend', shape => {
      this.setBboxFromShape(shape.layer._latlngs[0]);
    });

    // When the user starts drawing, the previously drawn layer is removed
    this.mapService.addDrawEvent('editable:vertex:deleted', shape => {
      this.setBboxFromShape(shape.layer._latlngs[0]);
    });
  }

  /**
   * Assigns an array of lat lngs to the bounding box.
   *
   * @param latLngs Array of lat/lon to be used for shape definition
   */
  setBboxFromShape(latLngs: any) {
    if (this.boundingBox !== latLngs && latLngs.length >= 3) {
      this.boundingBox = latLngs;
      return true;
    }
    return false;
  }

  onDrawRectangleClicked() {
    this.prepareDrawing();
    this.mapService.drawBox();
  }

  prepareDrawing() {
    console.log('Dibujando', this.isDrawingEnabled);
    this.isLocationExpanded = false;
    // If the drawing is enabled, we remove the temporary layer from the map
    // to start a new drawing
    if (this.isDrawingEnabled) {
      this.clearDrawing();
    }
    this.isDrawingEnabled = true;
  }

  clearDrawing() {
    this.mapService.commitDrawing();
    this.mapService.removeLayerFromMap('temp');
  }

  search() {
    this.resetValues();
      let objSearch = this.validations(this.selectedCampain, this.startDate, this.endDate);
      if(objSearch!==undefined) {
      //console.log(objSearch.toString());
        
        this.simoceanService.getPackageSearch(objSearch)
                            .subscribe((data) => {
                              if(data['success']==true && data['result']['count']>0) {
                                let result = data['result'];
                                //console.log(result);
                                //this.totalItems = result['count'];
                                this.campains = result['search_facets']['organization']['items'].map(g => {return g.name});
                                /* this.datasetList = Utils.parsePackageResults(result['results']);
                                this.totalItems = this.datasetList.length; */
                                
                                /* this.setDatasetValues(this.datasetList, this.paginator);
                                console.log(this.datasetList); */
                              }
                              else {
                                this.errorMessage = "Your search has no results";
                              }
                            });
      }
  }

  getCampainsList() {
    const campainsListURL : string = 'organization_list';
    this.simoceanService.getComboContent(campainsListURL)
                        .subscribe((data) => {
                          if(data['success']==true) {
                            this.campains = data['result'];
                          }
    });
  }

  private setDatasetValues(datasetList: DatasetDetail[], paginator: MatPaginator) {
    //this.dataSource = new MatTreeFlatDataSource<DatasetDetail>(datasetList);
    //this.dataSource.paginator = paginator;
  }

  private resetValues() {
    this.errorMessage = "";
  }

  private validations(selectedOrg: string, startTime: Date, stopTime: Date) : Search {
    console.log(selectedOrg + " Fecha : "+startTime);
    let objSearch : Search = this.validationsDates(selectedOrg, startTime, stopTime);
    if(startTime===undefined && stopTime===undefined && this.validateSelect(selectedOrg)) {
      this.errorMessage = "You should select at least a filter to search";
      return;
    }
    return objSearch;
  }

  private validateSelect(value : string) : boolean {
    return value===undefined;
  }

  private validationsDates(selectedOrg: string, startTime: Date, stopTime: Date) : Search {
    let tempEndDate, tempStartDate : Date;
    if(startTime!==undefined && stopTime===undefined) {
       //console.log("Primer if startTime");
      tempStartDate = startTime;
      tempEndDate = startTime;
    }
    else if(startTime===undefined && stopTime!==undefined) {
      //console.log("Segundo if stopTime");
      tempStartDate = stopTime;
      tempEndDate   = stopTime;
    }
    else if(startTime!==undefined && stopTime!==undefined) {
      //console.log("Tercer if " + (stopTime.getTime() > startTime.getTime()));
      if(startTime!==null && stopTime!==null && (startTime.getTime() > stopTime.getTime())) {
        this.errorMessage = "The 'End date' must be greater than the 'start date'";
        return;
      }
      tempStartDate = startTime; 
      tempEndDate   = stopTime;
    }
    
    return new Search(selectedOrg, tempStartDate, tempEndDate);
  }

}
