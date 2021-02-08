import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Event } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { AbTest } from 'src/framework/ab-test';
import { Observable } from 'rxjs';
import { AbTestsService } from 'src/framework/ab-tests.service';

const TEST_NAME = "detailButtonEnter";

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
  hero: Hero;
  abTest: AbTest;
  private _lastKeyPress = 0;
  private _timeClickedOn: number = 0;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private _abService: AbTestsService,
    private location: Location
  ) {
    this.abTest = _abService.getAbTest(TEST_NAME);
  }

  ngOnInit(): void {
    this.getHero();
    this._timeClickedOn = performance.now();
  }

  ngOnDestroy(): void {
    this._abService.save([this.abTest]);
  }

  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    // this.abTest.addMetric()
    this.abTest.addTimerMetric("lastKeyPress", this._lastKeyPress - this._timeClickedOn);

    this.location.back();
  }

  save(): void {
    this.abTest.addTimerMetric("saving", performance.now() - this._timeClickedOn);

    this.heroService.updateHero(this.hero)
      .subscribe(() => this.goBack());
  }

  OnTextBoxFocus() {
    this.abTest.addTimerMetric("focusing", performance.now() - this._timeClickedOn);
  }

  OnTextBoxKeyDown(event: KeyboardEvent) {
    if (event.key.toLowerCase() !== "enter") {
      this._lastKeyPress = performance.now();
    } else {
      if (this.abTest.getMetric("enterPresses")) {
        this.abTest.incrementCounter("enterPresses")
      } else {
        this.abTest.addCounterMetric("enterPresses", 1);
      }
    }
  }
}
