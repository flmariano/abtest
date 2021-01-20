import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AbTest } from 'src/framework/ab-test';
import { HeroService } from './hero.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Tour of Heroes';
  abTests$: Observable<AbTest[]>;
  abTest1: AbTest;
  abTest2: AbTest;

  constructor(private _heroService: HeroService) {
    this.abTests$ = _heroService.getAbTests();
    this.abTests$.subscribe((r) => {
      this.abTest1 = r.find((t) => t.testName === "detailButtonEnter")
      this.abTest2 = r.find((t) => t.testName === "addButtonPos")
    })
  }

  logAbTest() {
    this._heroService.logAbResults();
  }
}
