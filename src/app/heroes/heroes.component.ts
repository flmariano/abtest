import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AbTest } from 'src/framework/ab-test';
import { AbTestsService } from 'src/framework/ab-tests.service';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[];
  abTest: AbTest;

  constructor(private _abService: AbTestsService,
    private _heroService: HeroService) {
    this.abTest = _abService.getAbTest("detailButtonEnter");
  }

  ngOnInit() {
    this.getHeroes();
  } 

  getHeroes(): void {
    this._heroService.getHeroes()
    .subscribe(heroes => this.heroes = heroes);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this._heroService.addHero({ name } as Hero)
      .subscribe(/* hero => {
        this.heroes.push(hero);
      } */);
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this._heroService.deleteHero(hero).subscribe();
  }

}
