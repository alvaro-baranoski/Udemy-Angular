import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ILoginResponse } from 'src/app/interfaces/ILoginResponse';
import { ISignUpResponse } from 'src/app/interfaces/ISignUpResponse';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  isLoginMode = false;
  isLoading = false;
  errorMessage: string = null;

  constructor(private authService: AuthService, private router: Router) { }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm) {
    if (authForm.invalid) return;

    const email = authForm.value.email;
    const password = authForm.value.password;
    this.isLoading = true;

    let authObservable: Observable<ISignUpResponse | ILoginResponse>;

    if (this.isLoginMode) {
      authObservable = this.authService.login(email, password);
    } else {
      authObservable = this.authService.signUp(email, password)
    }

    authObservable.subscribe({
      next: (response) => {
        console.log(response);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error: (error) => {
        this.errorMessage = error;
        this.isLoading = false;
      }
    });

    authForm.reset();
  }
}
