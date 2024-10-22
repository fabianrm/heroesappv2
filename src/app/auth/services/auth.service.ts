import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  private _baseUrl = environments.baseUrl;
  private _user?: User;

  get currentUser(): User | undefined {
    if (!this._user) return undefined;
    return structuredClone(this._user);
  }

  Login(email: string, password: string): Observable<User | undefined> {
    return this.http.get<User>(`${this._baseUrl}/users/1`)
      .pipe(
        tap(user => this._user = user),
        tap(user => localStorage.setItem('token', 'asjhasjhasjsa.uyweqsa23jja.8793jsas')),
        catchError(err => of(undefined))
      )
  }


  checkAuthentication(): Observable<boolean> {

    if (!localStorage.getItem('token')) return of(false);

    const token = localStorage.getItem('token');

    return this.http.get<User>(`${this._baseUrl}/users/1`)
      .pipe(
        tap(user => this._user = user),
        map(user => !!user),
        catchError(err => of(false))
      );

  }



  logout() {
    this._user = undefined;
    localStorage.clear();
  }

}
