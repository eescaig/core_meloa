import { Component, OnInit, Injectable } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource, PageEvent } from '@angular/material';
import { BehaviorSubject, Observable, of } from 'rxjs';

export class FileNode {
  children: FileNode[];
  filename: string;
  type: any;
}

/** Flat node with expandable and level information */
export class FileFlatNode {
  constructor(
    public expandable: boolean, public filename: string, public level: number, public type: any) {}
}

const TREE_DATA = JSON.stringify({
  Campain_25062018: {
    Wavy1:25062018,
    Wavy2:25062018,
    Wavy3:25062018
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
  providers: [FileDatabase]
})
export class CatalogueResultsComponent implements OnInit {
  
  treeControl: FlatTreeControl<FileFlatNode>;
  treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;
  dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;
  numPages: number;
  featuresResults: any;
  currentPage: number;

  constructor(database: FileDatabase) { 
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
  }

}
