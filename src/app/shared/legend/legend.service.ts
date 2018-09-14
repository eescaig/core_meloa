import { MapService } from './../map/map.service';
import { Wavy } from './../../catalogue-browser/shared/models/wavy.model';
import { BehaviorSubject } from 'rxjs/index';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LegendService {

  public static heightsSource: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(new Array<number>());
  public static velocitiesSource: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(new Array<number>());

  public static scaleObject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public static valueLegend: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public static wavys: BehaviorSubject<Wavy[]> = new BehaviorSubject<Wavy[]>(null);

  constructor(private mapService: MapService) { }

  addPointsToLayer(wavysArray : Wavy[], scale: any, value: number) {
    //console.log(wavysArray);
    if (wavysArray!==undefined) {
      wavysArray.map(wavy => {
        let property = value==1 ? wavy.height : (value==2 ? wavy.speed : wavy.temperature);
        let color = scale(property)
        //console.log(color);
        this.mapService.addPointLayer(wavy, color);
      });
    }
  }

  removePoints(list: Wavy[]) {
    list.map(obj => { 
      //console.log(obj);
      //let nameLayer : string = "point" + obj.record;
      this.mapService.removeLayerFromMap(obj.id);
    });
  }
  
  addPolylineToLayer(latlngsPoly : number[][], value: number) {
    let color = value==1 ? "#137fba80" : (value==2 ? "#FD8D3C" : "#137fba80");
    this.mapService.addPolylineLayer("poly1", latlngsPoly, color);
  }
  
  removePolyline() {
    this.mapService.removeLayerFromMap("poly1"); 
  }

  assignHeight(height: number[]) {
    LegendService.heightsSource.next(height);
  }

  getHeight() {
    return LegendService.heightsSource.asObservable();
  }

  assignVelocity(velocity: number[]) {
    LegendService.velocitiesSource.next(velocity);
  }
  
  getVelocities() {
    return LegendService.velocitiesSource.asObservable();
  }
  
  assignScaleObject(scale : any) {
    LegendService.scaleObject.next(scale);
  }

  getScaleObject() {
    return LegendService.scaleObject.asObservable();
  }

  assignValueLegend(value : number) {
    LegendService.valueLegend.next(value);
  }

  getValueLegend() {
    return LegendService.valueLegend.asObservable();
  }

  assignWavys(aWavys: Wavy[]) {
    LegendService.wavys.next(aWavys);
  }

  getWavys() {
    return LegendService.wavys.asObservable();
  }

}
