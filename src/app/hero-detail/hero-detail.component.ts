import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  private testName = "detailButtonEnter";

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {
    this.abTests$ = heroService.getAbTests();
    this.abTests$.subscribe((r) => {
      this.abTest = r.find((t) => t.testName === this.testName)
    })
  }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (!this.heroService.getMetric(this.testName,"saveConfirm")) {
      this.heroService.addMetric(this.testName,"saveConfirm", "counter");
    }
    this.heroService.addCount(this.testName,"saveConfirm", "saving");

    this.heroService.updateHero(this.hero)
      .subscribe(() => this.goBack());
  }

  OnTextBoxFocus() {
    if (!this.heroService.getMetric(this.testName,"saveConfirm")) {
      this.heroService.addMetric(this.testName,"saveConfirm", "counter");
    }
    this.heroService.addCount(this.testName,"saveConfirm", "focusing");
  }
}
