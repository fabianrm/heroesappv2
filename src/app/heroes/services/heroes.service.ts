import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environments } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private _baseUrl: string = environments.baseUrl;

  constructor(private http: HttpClient) { }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this._baseUrl}/heroes`);
  }

  getHeroById(id: string): Observable<Hero | undefined> {
    return this.http.get<Hero>(`${this._baseUrl}/heroes/${id}`)
      .pipe(
        catchError(err => of(undefined)) //Retorna un observable (of) si da error
      )
  }

  getSuggestions(query: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this._baseUrl}/heroes?q=${query}&_limit=10`);
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(`${this._baseUrl}/heroes`, hero);
  }

  updateHero(hero: Hero): Observable<Hero> {
    if (!hero.id) throw Error('Hero id is required');
    return this.http.patch<Hero>(`${this._baseUrl}/heroes/${hero.id}`, hero);
  }

  deleteHeroById(id: string): Observable<boolean> {
    if (!id) throw Error('Hero id is required');
    return this.http.delete(`${this._baseUrl}/heroes/${id}`)
      .pipe(
        map(resp => true),
        catchError(err => of(false)),
      );

  }







}
