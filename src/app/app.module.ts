import { HttpClientModule } from '@angular/common/http';
import { CatalogueBrowserModule } from './catalogue-browser/catalogue-browser/catalogue-browser.module';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import 'hammerjs';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MeloaMaterialModule } from './meloa-material/meloa-material.module';


const meloaRoutes: Routes = [
  { path: '', redirectTo: '/catalogue', pathMatch: 'full' },
  { path: '',  component: AppComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(meloaRoutes),
    MeloaMaterialModule,
    CatalogueBrowserModule
  ],
  exports: [
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
