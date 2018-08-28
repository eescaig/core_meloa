import { MapComponent } from './../../shared/map/map.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MapService } from '../../shared/map/map.service';

@Component({
  selector: 'app-dialog-add-overlay',
  templateUrl: './dialog-add-overlay.component.html',
  styleUrls: ['./dialog-add-overlay.component.scss'],
  providers: [MapService, MapComponent]
})
export class DialogAddOverlayComponent implements OnInit {
  
  nameOverlay: string;
  descriptionOverlay: string;
  urlWMS: string;
  layerWMS: string;
  mapaOver: any;

  constructor(private mapService: MapService,
    public dialogRef: MatDialogRef<DialogAddOverlayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.mapaOver = data;
    //console.log(this.mapaOver);
  }

  ngOnInit() {

  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onAddClick() {
    //validations
    //console.log(this.mapaOver);
    let layer = this.mapService.addWMSLayerToMapLayers(this.urlWMS, this.layerWMS, this.mapaOver);
    if( layer !== undefined ) {
      this.onCancelClick();
    }
  }

}
