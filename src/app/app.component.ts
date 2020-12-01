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
  loadTime: string;

  private readonly timerName = "t1";
  private readonly timerName2 = "t2";
  private timerStartTime: number;

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

    var time = performance.now();
    console.log("AppComponent ngOnInit: " + time + " ms");
    this._abService.setLoadTime(time);
    this.loadTime = time.toFixed(0);

    this._abService.startTimer(this.timerName);
    this._abService.startTimer(this.timerName2);
  }

  onClickStart() {
    this._abService.startTimer(this.timerName);
  }

  onClickStop() {
    this._abService.saveMeasurements([this.timerName, this.timerName2]);
  }

  getTime(): string {
    let diff = 0;
    
    if(this.timerStartTime) {
      diff = performance.now() - this.timerStartTime;
    } else {
      this.timerStartTime = this._abService.getTimerStartTime(this.timerName);
    }

    if(diff) {
      let date = new Date(diff);
      return date.toISOString().slice(14, -1); //only get the m, s and ms parts
    }
    else {
      return '';
    }
  }
}
