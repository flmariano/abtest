import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './message.service';
import { AbTest } from 'src/framework/ab-test';
import { AbTestsService } from 'src/framework/ab-tests.service';
import { AbTestsCount, AbTestsCounterMetric, MetricType } from 'src/framework/ab-tests-metric';


@Injectable({ providedIn: 'root' })
export class HeroService {

  private heroes: Hero[] = [
    { id: 11, name: 'Dr Nice' },
    { id: 12, name: 'Narco' },
    { id: 13, name: 'Bombasto' },
    { id: 14, name: 'Celeritas' },
    { id: 15, name: 'Magneta' },
    { id: 16, name: 'RubberMan' },
    { id: 17, name: 'Dynama' },
    { id: 18, name: 'Dr IQ' },
    { id: 19, name: 'Magma' },
    { id: 20, name: 'Tornado' }
  ];

  private _defaultAbTestName = "test1";
  private _defaultAbTest = this._abTestsService.getAbTest(this._defaultAbTestName);

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private _abTestsService: AbTestsService) {
      _abTestsService.sendArrivalData(this._defaultAbTest);
    }

  getAbTest(): Observable<AbTest> {
    return of(this._defaultAbTest);
  }

  addMetric(metricName: string, type: MetricType) {
    this._defaultAbTest.addMetric(metricName, type);
  }

  getMetric(metricName: string): AbTestsCounterMetric {
    return this._defaultAbTest.getMetric(metricName);
  }

  addCount(metricName: string, name?: string) {
    this._defaultAbTest.addCount(metricName, name);
  }

  logAbResults() {
    console.log(this._abTestsService.save(this._defaultAbTest))
  }

  saveAbResults() {
    this._abTestsService.save(this._defaultAbTest);
  }

  /** GET heroes from the server */
  getHeroes(): Observable<Hero[]> {
    return of(this.heroes);
  }

  /** GET hero by id. Return `undefined` when id not found */
  getHeroNo404<Data>(id: number): Observable<Hero> {
    let r = this.heroes.find((h) => {
      if(h.id == id) return h;
    })
    return of(r);
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<Hero> {
    return this.getHeroNo404(id)
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return of(this.heroes.filter((h) => {
      if (h.name.toLowerCase().includes(term)) return h;
    }))
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    let h = {
      id: this.generateId(),
      name: hero.name
    }

    this.heroes.push(h);
    return of(h);
  }
  private generateId() {
    return this.heroes.length > 0 ? Math.max(...this.heroes.map(hero => hero.id)) + 1 : 11;
  }

  /** DELETE: delete the hero from the server */
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    
    this.heroes = this.heroes.filter((h) => {
      if(h.id !== id) return h;
    })

    return of();
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {
    let r = this.heroes.find((h) => {
      if (h.id === hero.id) return h;
    })
    if (r) {
      this.heroes.reduce((p, c, i, arr) => {
        if(c.id !== r.id) return c;
        else return r;
      })
    }

    return of(hero);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
