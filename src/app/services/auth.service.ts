import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userAuth = false;
  private loginUrl = 'http://localhost:3000/auth/login'
  private logoutUrl = 'http://localhost:3000/auth/logout'
  private validateUrl = 'http://localhost:3000/auth/validate'

  private testUrl = 'http://localhost:3000/home'
  
  constructor(private http: HttpClient) { }

  isAuthenticated(): Observable<boolean> {
    if(this.userAuth){
      return of(true);
    }

    return this.http.get<{success: boolean}>(this.validateUrl, {withCredentials: true}).pipe(
      map((response) => {
        this.userAuth = response.success
        return this.userAuth;
      }),
      catchError((error) => {
        this.userAuth = false;
        return of(false);
      })
    )
  }

  login(credentials: any): Observable<any> {
    return this.http.post<{ success: boolean }>(this.loginUrl, credentials, { withCredentials: true }).pipe(
      map((response) => {
        this.userAuth = response.success;
        return response;
      }),
      catchError((error) => {
        return of(false);
      })
    );
  }

  logout(): Observable<boolean> {
    return this.http.post<{ success: boolean }>(this.logoutUrl, null, { withCredentials: true }).pipe(
      map((response) => {
        this.userAuth = false;
        return response.success;
      }),
      catchError((error) => {
        return of(false);
      })
    );
  }


  logintest(body: any): Observable<any> {
    return this.http.post<{ success: boolean }>(this.testUrl, body, { withCredentials: true })
  }
}
