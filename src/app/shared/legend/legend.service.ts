import { BehaviorSubject, ReplaySubject } from 'rxjs/index';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LegendService {

  public static heightsSource: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(new Array<number>());
  public static velocitiesSource: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(new Array<number>());

  constructor() { 
    //console.log('constructor!!!')
  }

  assignHeight(height: number[]) {
    LegendService.heightsSource.next(height);
  }

  assignVelocity(velocity: number[]) {
    LegendService.velocitiesSource.next(velocity);
  }

  getHeight() {
    return LegendService.heightsSource.asObservable();
  }

  getVelocities() {
    return LegendService.velocitiesSource.asObservable();
  }

}
