import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from "rxjs/operators";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  
  activeLinkIndex = 0;
  navStart: Observable<NavigationStart>;
  siteLinks = [
    {
      link: 'catalogue',
      icon: 'search',
      text: 'Discover',
      tooltip: 'Discover your data'
    },
    {
      link: 'application',
      icon: 'directions_run',
      text: 'Run',
      tooltip: 'Run your application'
    },
    {
      link: 'geoportal',
      icon: 'public',
      text: 'View',
      tooltip: 'View your data'

    }
  ]

  constructor(private router: Router) {
    this.navStart = router.events.pipe(
      filter(evt => evt instanceof NavigationStart)
    ) as Observable<NavigationStart>;
        
  }

  ngOnInit() {
    this.navStart.subscribe((routeData: any) => {
      if (routeData.url.split('/')[1] === 'catalogue' && this.activeLinkIndex !== 0) {
        this.activeLinkIndex = 0;
      } else if (routeData.url.split('/')[1] === 'application' && this.activeLinkIndex !== 1) {
        this.activeLinkIndex = 1;
      } else if (routeData.url.split('/')[1] === 'application' && this.activeLinkIndex !== 1) {
        this.activeLinkIndex = 2;
      }
    });
  }

}
