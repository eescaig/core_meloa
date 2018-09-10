import { Search } from './../models/search.model';
import { DatasetList } from './../models/dataset-list.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CatalogueSimoceanService {
  
  readonly apiBaseUrl = 'http://catalogue.simocean.pt/api/3/action';
  
  constructor(private http: HttpClient) { }

  getComboContent(customizableURL: string) {
    const customizableListURL = this.apiBaseUrl + '/' + customizableURL;
    return this.http.get<Observable<DatasetList>>(customizableListURL);
  }

  getPackageSearch(objectSearch: Search) {
    let packageListURL = this.apiBaseUrl + '/package_search?';
    const facetField = '&facet.field=organization&facet.field=groups&facet.field=tags&rows=40000';
    let addOrgs = "";
    let startTime : string = "";
    let stopTime : string  = "";
    //http://catalogue.simocean.pt/api/3/action/package_search?fq=organization%3A%22ipma%22+groups%3A%22sea-wave-direction-swd%22+tags%3A%22Dire%C3%A7%C3%A3o+m%C3%A9dia+das+ondas%22&facet.field=organization&facet.field=groups&facet.field=tags
    if(objectSearch!=undefined) {
       let filters : number = 0;
       if(objectSearch.organizations.length>0) {
          addOrgs = 'organization:' + '"' + objectSearch.organizations  + '"';
          packageListURL = filters==0 ? (packageListURL + 'fq=' + addOrgs) : '';
          filters++;
       }
       
       if(objectSearch.startDate!=undefined && objectSearch.endDate!=undefined) {
          startTime = this.formatDate(objectSearch.startDate);
            console.log(startTime);
          stopTime = this.formatDate(objectSearch.endDate);
            console.log(stopTime);

          let addDate : string = this.concatDateURL(startTime, stopTime);
          packageListURL = filters==0 ? (packageListURL + 'fq=' + addDate) : (packageListURL + '+' + addDate);  
       }
    }
    packageListURL = packageListURL + facetField;
    console.log(packageListURL);
    return this.http.get(packageListURL);
  }

  private formatDate(inicialDate : Date) : string {
    let date;
    date = new Date(Date.UTC(inicialDate.getFullYear(), inicialDate.getMonth(), inicialDate.getDate(),  
                             inicialDate.getHours(), inicialDate.getMinutes(), inicialDate.getSeconds()));
    return date.toISOString();
  }

  private concatDateURL(startTime: string, stopTime: string) : string {
      let dateUrlStr: string = "(extras_StartTime:[inicio+TO+fin]+OR+extras_StopTime:[inicio+TO+fin]+OR+(extras_StartTime:[*+TO+inicio]+AND+extras_StopTime:[fin+TO+*]))";
      let result: string = dateUrlStr.replace(new RegExp('inicio', 'g'), startTime).replace(new RegExp('fin', 'g'), stopTime);
      return result;
  }
}
