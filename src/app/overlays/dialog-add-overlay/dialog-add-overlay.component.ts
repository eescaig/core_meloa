import { HttpClient, HttpEventType } from '@angular/common/http';
import { MapComponent } from './../../shared/map/map.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MapService } from '../../shared/map/map.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog-add-overlay',
  templateUrl: './dialog-add-overlay.component.html',
  styleUrls: ['./dialog-add-overlay.component.scss'],
  providers: [MapService, MapComponent]
})
export class DialogAddOverlayComponent implements OnInit {
  
  mapaOver: any;
  selectedFile: File = null;

  //Validations variables
  /* if use FormBuilder inportandolo en el constructor uqeda así
  profileForm = this.fb.group({
    firstName: [''],...}] */
  dialogInputForm = new FormGroup({
    nameForm : new FormControl('', [Validators.required]),
    descriptionForm : new FormControl('', [Validators.required]),
    urlForm : new FormControl('', [Validators.required]),
    layerForm : new FormControl('', [Validators.required])
  });

  

  get name() : any {return this.dialogInputForm.get('nameForm');}
  get description() : any {return this.dialogInputForm.get('descriptionForm');}
  get url() : any {return this.dialogInputForm.get('urlForm');}
  get layer() : any {return this.dialogInputForm.get('layerForm');}
  
  //setValue() { this.dialogInputForm.setValue({name: 'Carson', descriptionForm: 'Drew'}); }

  constructor(private mapService: MapService, private http: HttpClient,
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
  
  /**
   * Metodos subida de fichero
   * @param event 
   */
  onFileSelected(event) {
    this.selectedFile = <File> event.target.files[0];
  }

  onUpload() {
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name);
    this.http.post('//uploadImages', fd, {
      reportProgress: true,
      observe: 'events'
    })
    .subscribe(event => {
        switch (event.type) {
          case HttpEventType.Sent:
            return `Uploading file "${this.selectedFile.name}" of size ${this.selectedFile.size}.`;
      
          case HttpEventType.UploadProgress:
            // Compute and show the % done:
            const percentDone = Math.round(100 * event.loaded / event.total);
            return `File "${this.selectedFile.name}" is ${percentDone}% uploaded.`;
      
          case HttpEventType.Response:
            return `File "${this.selectedFile.name}" was completely uploaded!`;
      
          default:
            return `File "${this.selectedFile.name}" surprising upload event: ${event.type}.`;
        }
    });
  }

  onSubmit() {
    console.log(this.dialogInputForm.get('nameForm').value);
  }

  onAddClick() {
    //validations
    //console.log(this.mapaOver);
    console.log(this.dialogInputForm.get('nameForm').value);
    let layer = this.mapService.addWMSLayerToMapLayers(this.url, this.layer, this.mapaOver);
    if( layer !== undefined ) {
      this.onCancelClick();
    }
  }

}
