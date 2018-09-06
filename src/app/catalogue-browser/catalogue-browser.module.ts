import { FormsModule } from '@angular/forms';
import { OverlaysModule } from './../overlays/overlays.module';
import { FooterModule } from './../footer/footer.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeloaMaterialModule } from './../meloa-material/meloa-material.module';
import { CatalogueBrowserComponent } from './catalogue-browser.component';
import { CatalogueBrowserRoutingModule } from './catalogue-browser-routing/catalogue-browser-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MapModule } from '../shared/map/map.module';
import { CatalogueSearchComponent } from './catalogue-search/catalogue-search.component';
import { CatalogueResultsComponent } from './catalogue-results/catalogue-results.component';
import { PapaParseModule } from 'ngx-papaparse';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MeloaMaterialModule,
    MapModule,
    CatalogueBrowserRoutingModule,
    FooterModule,
    OverlaysModule,
    PapaParseModule
  ],
  declarations: [
    CatalogueBrowserComponent,
    CatalogueSearchComponent,
    CatalogueResultsComponent
  ]
})
export class CatalogueBrowserModule { }
