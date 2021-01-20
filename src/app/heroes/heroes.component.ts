import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AbTest } from 'src/framework/ab-test';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[];
  abTests$: Observable<AbTest[]>;
  abTest: AbTest;

  constructor(private heroService: HeroService) {
    this.abTests$ = this.heroService.getAbTests();
    this.abTests$.subscribe((r) => {
      this.abTest = r.find((t) => t.testName === "addButtonPos")
    })
  }

  ngOnInit() {
    this.getHeroes();
  } 

  getHeroes(): void {
    this.heroService.getHeroes()
    .subscribe(heroes => this.heroes = heroes);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(/* hero => {
        this.heroes.push(hero);
      } */);
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }

}
