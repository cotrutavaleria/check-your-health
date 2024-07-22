import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input } from '@angular/core';
import { Functionalities } from 'src/app/shared/responses/functionalities';

@Component({
  selector: 'app-tabs-routing',
  templateUrl: './tabs-routing.component.html',
  styleUrls: ['./tabs-routing.component.css']
})
export class TabsRoutingComponent {
  @Input() tabsList: Array<Functionalities> = [];
  hideTabLabel!:boolean;
  constructor(private screenSize: BreakpointObserver) { this.resize();}
  resize() {
    this.screenSize.observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait, Breakpoints.Small]).subscribe(result => {
      this.hideTabLabel = false;
      if (result.matches) {
        this.hideTabLabel = true;
      }
    });
  }
}
