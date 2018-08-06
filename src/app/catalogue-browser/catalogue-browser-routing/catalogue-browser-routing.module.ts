import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CatalogueBrowserComponent } from './../catalogue-browser.component';

const routes: Routes = [
  {  path: 'catalogue', component: CatalogueBrowserComponent  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class CatalogueBrowserRoutingModule { }
