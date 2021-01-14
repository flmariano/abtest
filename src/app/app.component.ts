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
  abTest$: Observable<AbTest>;

  constructor(private _heroService: HeroService) {
    this.abTest$ = _heroService.getAbTest();
  }

  logAbTest() {
    this._heroService.logAbResults();
  }
}
