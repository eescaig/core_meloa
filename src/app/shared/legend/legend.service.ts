import { Subject } from 'rxjs/index';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LegendService {
  
  private temperaturesSource = new Subject<Number>();
  private heightsSource = new Subject<Number>();
  private velocitiesSource = new Subject<Number>();

  temperatures$ = this.temperaturesSource.asObservable();
  heights$ = this.heightsSource.asObservable();
  velocities$ = this.velocitiesSource.asObservable();

  constructor() { }

  assignHeight(height: Number) {
    this.heightsSource.next(height);
    console.log(this.heightsSource);
  }

  assignVelocity(velocity: Number) {
    this.velocitiesSource.next(velocity);
  }

}
