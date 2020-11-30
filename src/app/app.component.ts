import { Component, OnInit } from '@angular/core';
import { AbTestsService } from 'src/framework/ab-tests.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title: string;
  version: string;

  constructor(private _abService: AbTestsService) { 
    console.log("AppComponent constructor: " + performance.now() + " ms");
  }

  ngOnInit(): void {
    let version = this._abService.getVersion();

    if (version) {
      this.title = version;
    }
    else {
      this.title = "getversion doesn't work.";
    }
  }

  ngAfterViewInit(): void {
    var time = performance.now();
    console.log("AppComponent ngAfterViewInit: " + time + " ms");
    this._abService.setLoadTime(time);
  }

  onClickStart() {
    this._abService.startMeasurement();
  }

  onClickStop() {
    this._abService.stopMeasurement();
  }

  getTime(): string {
    let diff = this._abService.getTimeDiff();

    if(diff) {
      let date = new Date(diff);
      return date.toISOString().slice(14, -1); //only get the m, s and ms parts
    }
    else {
      return '';
    }
  }
}
