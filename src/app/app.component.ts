import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AbTest } from 'src/framework/ab-test';
import { AbTestsService } from 'src/framework/ab-tests.service';
import { HeroService } from './hero.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Tour of Heroes';
  abTest1: AbTest;
  abTest2: AbTest;

  constructor(private _abService: AbTestsService) {
    this.abTest1 = _abService.getAbTest("detailButtonEnter");
    this.abTest2 = _abService.getAbTest("addButtonPos");

    // this.abTests$.subscribe((r) => {
    //   this.abTest1 = r.find((t) => t.testName === "detailButtonEnter")
    //   this.abTest2 = r.find((t) => t.testName === "addButtonPos")
    // })
  }

  // logAbTest() {
  //   this._heroService.logAbResults();
  // }
}
