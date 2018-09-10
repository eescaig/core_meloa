import { HttpClient, HttpEventType, HttpResponse, HttpHeaders } from '@angular/common/http';
import { MapComponent } from './../../shared/map/map.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MapService } from '../../shared/map/map.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { PapaParseService } from 'ngx-papaparse';
import { Subscription } from 'rxjs';

export class FileUploadModel {
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  sub?: Subscription;
}

@Component({
  selector: 'app-dialog-add-overlay',
  templateUrl: './dialog-add-overlay.component.html',
  styleUrls: ['./dialog-add-overlay.component.scss'],
  providers: [MapComponent]
})
export class DialogAddOverlayComponent implements OnInit {
  
  mapaOver : any;
  selectedFile : File = null;
  dialogInputForm : FormGroup;
  dataList : any;

  accept : string = 'image/*';
  urlImage : string = '';
  byteCharacters : any;
  
  //Validations variables
  /* if use FormBuilder importandolo en el constructor queda así
  profileForm = this.fb.group({
    firstName: [''],...}] */
  
  constructor(private mapService: MapService, private http: HttpClient,
    private papa: PapaParseService,
    public dialogRef: MatDialogRef<DialogAddOverlayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.mapaOver = data;

    this.dialogInputForm = new FormGroup({
      nameForm : new FormControl('', [Validators.required]),
      descriptionForm : new FormControl('', [Validators.required]),
      wms : new FormGroup({
        urlForm : new FormControl(''),
        layerForm : new FormControl('')
      }),
      overlay : new FormGroup({
        imgOverlay : new FormControl('')
      })
    });
    //console.log('%c [DialogAddOverlayComponent] Construyendo el componente', 'color: white; background-color: green');
  }

  ngOnInit() {
    //console.log("Init!!");
  }

  /** Get this properties from view */
  get name() : AbstractControl {return this.dialogInputForm.get('nameForm');}
  get description() : AbstractControl {return this.dialogInputForm.get('descriptionForm');}
  get wms() : any {return this.dialogInputForm.get('wms');}
  get url() : AbstractControl {return this.dialogInputForm.get('wms').get('urlForm');}
  get layer() : AbstractControl {return this.dialogInputForm.get('wms').get('layerForm');}
  get overlay() : any {return this.dialogInputForm.get('overlay');}
  get imgOverlay() : AbstractControl {return this.dialogInputForm.get('overlay').get('imgOverlay');}

  isLayerRequired(): boolean {
    return ((this.url.value !== '' && this.layer.value === ''));
  }

  isUrlRequired(): boolean {
    return ((this.layer.value !== '' && this.url.value ===''));
  }
  
  /** Metodos subida de fichero */
  onFileSelected(event) {
    this.selectedFile = <File> event.target.files[0];
    this.imageProcessing(this.selectedFile);
  }

  imageProcessing(selectedFile: File) {
    if(selectedFile) {
      let reader : FileReader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = (e: any) => { console.log(e);
        let str = e.target.result.substring(e.target.result.indexOf('4,')+2, e.target.result.length);
        this.byteCharacters = str;
        console.log(this.byteCharacters);
        /* this.files.push({ data: selectedFile, state: 'in', 
                         inProgress: false, progress: 0, canRetry: false, canCancel: true }); */
      };
    }
  }
  
  // Pruebas descargar la imagen como un blob
  onUploadLocal() {
    let byteNumbers = new Array(this.byteCharacters.length);
    for (var i = 0; i < this.byteCharacters.length; i++) {
        byteNumbers[i] = this.byteCharacters.charCodeAt(i);
    }
    
    var byteArray = new Uint8Array(byteNumbers);
    
    let blob = new Blob([byteArray], {"type": "image/jpeg"});
    	
    if(navigator.msSaveBlob) {
      let filename = 'fichier';
      navigator.msSaveBlob(blob, filename);
    } else {
      let link = document.createElement("a");

      link.href = URL.createObjectURL(blob);

      link.setAttribute('visibility','hidden');
      link.download = 'fichier';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
  
  // Subir la imagen a un server 
  onUpload() {
    const fd = new FormData();
    let response : any;
    fd.append('file', this.selectedFile);
    //let headers = new HttpHeaders().append('Content-Type', 'image/tiff');
    this.http.post('https://file.io', fd, {
                    reportProgress: true,
                    observe: 'events'
                  })
                  .subscribe(event => {
                    //console.log(event);
                      if(event.type === HttpEventType.UploadProgress) {
                          // Compute and show the % done:
                          const percentDone = Math.round(event.loaded / event.total * 100);
                          console.log("File " + this.selectedFile.name + " is " + percentDone + "% uploaded.");
                      }
                      else if(event.type === HttpEventType.Response) {
                        this.addOverlay(event);
                      }
                  });
    
  }

  addOverlay(response : any) {
    let bounds : number[][] = [];
    let corner1 : number[] = [Number.parseFloat("27.240.000"), Number.parseFloat("-16.690.000")];
    let corner2 : number[] = [Number.parseFloat("-17.580.000"), Number.parseFloat("34.930.000")];
    
    bounds.push(corner1);
    bounds.push(corner2);
    
    //'./d:/core-meloa/src/assets/img/MOS_EU_LAEA_2000.tif'
    
    //this.mapService.addOverlayToMapLayer(this.selectedFile.name, bounds, this.mapaOver);
    console.log(response);
    if(response.body["success"]) {
      this.urlImage = response.body.link;
    }
    // let layer = this.mapService.addOverlayToMapLayer(this.urlImage, bounds, this.mapaOver); //addOverlayGeoTiff(urlImage, this.mapaOver);
    // if(layer !== undefined) {
    //   this.onCancelClick();
    // }
  }
  // Subir la imagen a un server FIN ------- 


  onSubmit() {
    console.log(this.dialogInputForm.get('nameForm').value);
  }

  onAddClick() {
    //validations
    console.log(this.mapaOver);
    let result : any;
    let bounds : number[][] = [];
    let corner1 : number[] = [Number.parseFloat("-17.580.000"), Number.parseFloat("-16.690.000")];
    let corner2 : number[] = [Number.parseFloat("27.240.000"), Number.parseFloat("34.930.000")];
    
    bounds.push(corner1);
    bounds.push(corner2);
    
    //let headers = new HttpHeaders().append('Content-Type', 'image/tiff');

    this.http.get(this.urlImage, {responseType:'arraybuffer'})
    .subscribe(e => { console.log(e);
                      //console.log(URL.createObjectURL(e));
                        let blob = new Blob([e], { type: 'image/tiff' });
                        let url = window.URL.createObjectURL(blob);
                        console.log(url);
                        //window.open(url);
                    });

    // let boundsPrueba = [[-33.8650, 151.2094], [-35.8650, 154.2094]];
    // this.urlImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Sydney_Opera_House_-_Dec_2008.jpg/1024px-Sydney_Opera_House_-_Dec_2008.jpg';
    
    //this.urlImage = '../../../assets/img/MOS_EU_LAEA_2000.tif'; //'..//d:/core-meloa/src/assets/img/MOS_EU_LAEA_2000.tif'
    //adding a GeoTiff image
    if(this.urlImage!=='') {
      result = this.mapService.addOverlayToMapLayer(this.urlImage, bounds, this.mapaOver);
    } // adding a WMS
    else if(this.url.value !== '' && this.layer.value !== '') {
      result = this.mapService.addWMSLayerToMapLayers(this.url.value, this.layer.value, this.mapaOver);
    }
    
    //console.log(result);
    if( result !== undefined ) {
      this.onCancelClick();
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  /* onChangeUrl(event) {
    console.log(event.target.value);
    if(event.target.value!='') {
      this.dialogInputForm.get('wms').get('urlForm')
                          .setValidators([Validators.required]);
      this.dialogInputForm.get('wms').get('urlForm').updateValueAndValidity({onlySelf:true});                   
    }
    else if(event.target.value==='' && this.layer.value==='') {
      //  this.removeValidator('urlForm');
      this.dialogInputForm.get('wms').get('urlForm')
                          .setValidators(null);
      this.dialogInputForm.get('wms').get('urlForm').updateValueAndValidity({onlySelf:true});
    }
    
  }

  onChangeLayer(event) {
    console.log(event.target.value);
    if(event.target.value!='') {
      this.dialogInputForm.get('wms').get('layerForm')
                          .setValidators([Validators.required]); 
      this.dialogInputForm.get('wms').get('layerForm').updateValueAndValidity({onlySelf:true});                  
    } //Layer is empty
    else if(event.target.value==='' && this.url.value==='') { //eliminar solo si el otro input esta vacio
      //  this.removeValidator('layerForm');
      this.dialogInputForm.get('wms').get('layerForm')
                          .setValidators(null);
      this.dialogInputForm.get('wms').get('layerForm').updateValueAndValidity({onlySelf:true});
    }
    
  } */

  /* wmsUrlValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      console.log(' URL: ' + this.url.value + ' Layer: '+ this.layer.value);
      if(this.url.value!=='' && this.layer.value==='') {
        return {'isURL': true}; 
      }
      return null;
    };
  }
  wmsLayerValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if(this.layer.value!=='' && this.url.value==='') {
        return {'isLayer': true}; 
      }
      return null;
    };
  } 
  wmsUrlLayerValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      console.log(' URL: ' + this.url.value + ' Layer: '+ this.layer.value);
      if((this.url.value!=='' && this.layer.value==='') || (this.layer.value!=='' && this.url.value==='')) {
        return { notValid: true }; 
      }
      return null;
    };
  }
  */

}
