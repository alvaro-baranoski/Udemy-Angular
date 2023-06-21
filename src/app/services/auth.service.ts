import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ISignUpResponse } from '../interfaces/ISignUpResponse';
import { BehaviorSubject, Subject, catchError, tap, throwError } from 'rxjs';
import { ILoginResponse } from '../interfaces/ILoginResponse';
import { User } from '../models/User';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any; 


  constructor(private httpClient: HttpClient, private router: Router) { }

  signUp(email: string, password: string) {
    return this.httpClient.post<ISignUpResponse>(environment.signUpEndpoint, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError), tap(resData => this.handleUser(resData)));
  }

  login(email: string, password: string) {
    return this.httpClient.post<ILoginResponse>(environment.loginEndpoint, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError), tap(resData => this.handleUser(resData)));
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem("userData");
    if (this.tokenExpirationTimer)
      clearTimeout(this.tokenExpirationTimer);
  }

  autoLogin() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
    }

    const expirationDuration = 
      new Date(userData._tokenExpirationDate).getTime() - 
      new Date().getTime();
    
    this.autoLogout(expirationDuration);
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured!';
      if (!errorRes.error || !errorRes.error.error)
        return throwError(() => new Error(errorMessage));
      switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = 'This email exists already';
          break;
        case 'EMAIL_NOT_FOUND':
          errorMessage = 'This email does not exist';
          break;
        case 'INVALID_PASSWORD':
          errorMessage = 'This password is incorrect';
          break;
      }
      return throwError(() => new Error(errorMessage));
  }

  private handleUser(resData: ISignUpResponse | ILoginResponse) {
    const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
    const user = new User(
      resData.email,
      resData.localId,
      resData.idToken,
      expirationDate
    );
    this.user.next(user);
    this.autoLogout(parseInt(resData.expiresIn) * 1000)
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
