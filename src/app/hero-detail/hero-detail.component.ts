import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Event } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { AbTest } from 'src/framework/ab-test';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
  hero: Hero;
  abTests$: Observable<AbTest[]>;
  abTest: AbTest;
  private _testName = "detailButtonEnter";
  private _lastKeyPress = 0;
  private _timeClickedOn: number = 0;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {
    this.abTests$ = heroService.getAbTests();
    this.abTests$.subscribe((r) => {
      this.abTest = r.find((t) => t.testName === this._testName)
    })
  }

  ngOnInit(): void {
    this.getHero();
    this._timeClickedOn = performance.now();
  }

  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    this.heroService.addMetric(this._testName, "lastKeyPress", "timespan", this._lastKeyPress - this._timeClickedOn);

    this.heroService.saveAbResults(["detailButtonEnter"]);
    this.location.back();
  }

  save(): void {
    this.heroService.addMetric(this._testName, "saving", "timespan", performance.now() - this._timeClickedOn);

    this.heroService.updateHero(this.hero)
      .subscribe(() => this.goBack());
  }

  OnTextBoxFocus() {
    this.heroService.addMetric(this._testName, "focusing", "timespan", performance.now() - this._timeClickedOn);
  }

  OnTextBoxKeyDown(event: KeyboardEvent) {
    if (event.key.toLowerCase() !== "enter") {
      this._lastKeyPress = performance.now();
    } else {
      if (this.heroService.getMetric(this._testName, "enterPresses")) {
        this.heroService.incrementCounter(this._testName, "enterPresses")
      } else {
        this.heroService.addMetric(this._testName, "enterPresses", "counter", 1);
      }
    }
  }
}
