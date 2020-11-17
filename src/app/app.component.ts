import { Component, OnInit } from '@angular/core';
import { AbTestsService } from 'src/framework/ab-tests.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  titles: string[] = [];
  title: string;
  version: string;

  // @ViewChild("button") button: ElementRef;

  constructor(private _abService: AbTestsService) {
    this.titles[0] = 'A/B testing';
    this.titles[1] = 'A/B test testing';
    this.titles[2] = 'no testing';
  }

  ngOnInit(): void {
    var version = this._abService.getVersion();

    if (version != false) {
      this.title = version.toString();
    }
    else {
      this.title = this.titles[Math.floor(Math.random() * 100) % this.titles.length];
    }

    this.version = this.title; //changes later

    // this._abService.startMeasurement();
  }

  onClickStart() {
    this._abService.startMeasurement();
  }

  onClickStop() {
    this._abService.stopMeasurement(this.version);
  }

  getTime(): string {
    var diff = this._abService.getTimeDiff();

    if(diff) {
      var date = new Date(diff);
      return date.toISOString().slice(14, -1);
    }
    else {
      return '';
    }
  }

  // msToTime(t: number): string {
  //   var ms = t % 1000;
  //   var s = t / 1000;
  // }
}
