import { LegendService } from './../../shared/legend/legend.service';
import { MapComponent } from './../../shared/map/map.component';
import { MapService } from './../../shared/map/map.service';
import { Component, OnInit, Injectable, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource, PageEvent, MatCheckboxChange } from '@angular/material';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { PapaParseService } from 'ngx-papaparse';

export class FileNode {
  children: FileNode[];
  filename: string;
  type: any;
}

/** Flat node with expandable and level information */ //[[41.178241, -8.596044], [41.178239, -8.596048]]
export class FileFlatNode {
  constructor(
    public expandable: boolean, public filename: string, public level: number, public type: any) {}
}

const TREE_DATA = JSON.stringify({
  Campain_25062018: {
    Wavy1:25062018,
    Wavy2:26062018,
    Wavy3:27062018
  },
  Campain_01082018: {
    Wavy1:25062018,
    Wavy2:25062018,
    Wavy3:25062018,
    Wavy4:25062018,
    Wavy5:25062018
  },
  Campain_20082018: {
    Wavy1:25062018,
    Wavy2:25062018,
    Wavy3:25062018
  },
  Campain_01092018: {
    Wavy1:25062018,
    Wavy2:25062018,
    Wavy3:25062018,
    Wavy4:25062018,
    Wavy5:25062018
  }
});

@Injectable()
export class FileDatabase {
  dataChange = new BehaviorSubject<FileNode[]>([]);

  get data(): FileNode[] { return this.dataChange.value; }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Parse the string to json object.
    const dataObject = JSON.parse(TREE_DATA);

    // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
    //     file node as children.
    const data = this.buildFileTree(dataObject, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `FileNode`.
   */
  buildFileTree(obj: object, level: number): FileNode[] {
    return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new FileNode();
      node.filename = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.type = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }
}

@Component({
  selector: 'app-catalogue-results',
  templateUrl: './catalogue-results.component.html',
  styleUrls: ['./catalogue-results.component.scss'],
  providers: [FileDatabase, MapComponent, MapService, LegendService],
  encapsulation: ViewEncapsulation.None
})
export class CatalogueResultsComponent implements OnInit, AfterViewInit {
  
  treeControl: FlatTreeControl<FileFlatNode>;
  treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;
  dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;
  numPages: number;
  featuresResults: any;
  currentPage: number;

  selectedFile: File = null;
  dataList : any;

  mapa : any;
  heights : number[] = [];

  constructor(private mapService: MapService, private legengService: LegendService,
              private papa: PapaParseService, database: FileDatabase) 
  { 
    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel, this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<FileFlatNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    database.dataChange.subscribe(data => this.dataSource.data = data);
  }

  paginateResults(newPage: PageEvent) {
    // Store current page on session storage
    sessionStorage.setItem('pageNumber', JSON.stringify(newPage.pageIndex));

  }

  transformer = (node: FileNode, level: number) => {
    return new FileFlatNode(!!node.children, node.filename, level, node.type);
  }

  private _getLevel = (node: FileFlatNode) => node.level;

  private _isExpandable = (node: FileFlatNode) => node.expandable;

  private _getChildren = (node: FileNode): Observable<FileNode[]> => of(node.children);

  hasChild = (_: number, _nodeData: FileFlatNode) => _nodeData.expandable;

  ngOnInit() {
    this.legengService.assignHeight(this.heights);
  }

  ngAfterViewInit() {
    this.mapService.getLeafletMapInstance()
                   .subscribe((map) => { 
                                 this.mapa = map
                                 console.log('ngAfterViewInit Result component ', map);
                               });
  }

  onFileSelected(event) {
    this.selectedFile = <File> event.target.files[0];
    this.fileProcessing(this.selectedFile);
    
  }

  fileProcessing(selectedFile: File) {
    if(selectedFile) {
      let reader : FileReader = new FileReader();
      reader.readAsText(selectedFile);
      reader.onload = (e: any) => {
        this.papa.parse(e.target.result, {
          header: true,
          skipEmptyLines: true,
          complete: (result, selectedFile) => {
            //console.log(result);
            this.dataList = result.data;
          }
        })
      };
    }
  }

  onChangeCheckbox(event: MatCheckboxChange, type: any) {
    
    this.mapService.setValueOfMap(this.mapa);
    let latlngsPoly : number[][] = [];
    
    let velocities : number[] = [];

    if(event.checked) {
      //console.log(this.dataList);
      this.dataList.map(obj => {
          this.heights.push(Number.parseFloat(obj.height));
          velocities.push(Number.parseFloat(obj.speed));
  
          let latlng : number[] = [Number.parseFloat(obj.latitude), Number.parseFloat(obj.longitude)];
          latlngsPoly.push(latlng);
          let nameLayer : string = "point" + obj.record;
          
          this.mapService.addPointLayer(nameLayer, latlng, "#ff7800");
      });
      // Asignar variables para la leyenda
      this.legengService.assignHeight(this.heights);
      this.legengService.assignVelocity(velocities);

      this.mapService.addPolylineLayer("poly1", latlngsPoly, "#ff7800");
      // Mostrar el nivel de zoom del mapa
      this.mapService.onChangeZoom();
     /*  this.legengService.getHeight().subscribe((height) => console.log('height ' + height));
      this.legengService.getVelocities().subscribe((vel) => {console.log('vel ' + vel)}); */
      
    }
    else {
      this.dataList.map(obj => { 
          //console.log(obj);
          let nameLayer : string = "point" + obj.record;
          this.mapService.removeLayerFromMap(nameLayer);
      });
      this.mapService.removeLayerFromMap("poly1"); 
      this.mapService.onChangeZoom();
    }
  }

}