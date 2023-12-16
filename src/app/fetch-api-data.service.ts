import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://bond-flix-9c1709905a90.herokuapp.com/';
@Injectable({
  providedIn: 'root',
})
export class UserRegistrationService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}
  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  // User login endpoint
  userLogin(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'login?', new URLSearchParams(userDetails), {})
      .pipe(catchError(this.handleError));
  }

  // Unregister user endpoint
  userDelete(userDetails: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return this.http
      .delete(apiUrl + user.userName, {})
      .pipe(catchError(this.handleError));
  }

  // Update user information endpoint
  userUpdate(userDetails: any): Observable<any> {
    const user = localStorage.getItem('user');
    return this.http
      .put(apiUrl + 'users/' + user, {})
      .pipe(catchError(this.handleError));
  }

  // Get data for all movies endpoint
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Adding favourite movie endpoint
  addFavourite(movieID: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.FavoriteMovies.push(movieID);
    return this.http
      .post(apiUrl + 'users/' + user + 'movies' + movieID, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Remove favourite movie point
  removeFavourite(movieID: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const index = user.FavoriteMovies.indexOf(movieID);
    if (index >= 0) {
      user.FavoriteMovies.splice(index, 1);
    }
    return this.http
      .delete(apiUrl + 'users/' + user + 'movies/' + movieID, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get data on one movie endpoint
  getMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/' + title, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get data on one director endpoint
  getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/' + directorName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get data on actor endpoint
  getActor(actorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/' + actorName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }
}