import { Component, OnInit, Input } from '@angular/core';
import { DialogAddOverlayComponent } from './dialog-add-overlay/dialog-add-overlay.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-overlays',
  templateUrl: './overlays.component.html',
  styleUrls: ['./overlays.component.scss']
})
export class OverlaysComponent implements OnInit {
  @Input() mapa: any;
  errorMessage : string = "";

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddOverlayComponent, {
      width: '450px',
      data: this.mapa
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

}
