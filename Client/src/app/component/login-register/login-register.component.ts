import { Component } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../service/auth.service";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent {

  isLogin = true;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private snackBar: MatSnackBar) {
  }

  loginForm = this.formBuilder.group({
    credential: ['', Validators.required],
    password: ['', Validators.required]
  });

  registerForm = this.formBuilder.group({
    username: ['', Validators.required],
    email: [''],
    phone: [''],
    newPassword: ['', Validators.required]
  })

  login() {
    const val = this.loginForm.value;

    if (val.credential && val.password) {
      this.authService.login({credential: val.credential, password: val.password}).subscribe({
        next: (response) => {
          this.authService.setTokenAndUsername(response.token, response.username);
        },
        error: (error) => {
          console.log(error);
          if (error.status === 404) {
            this.snackBar.open(error.error.message, '', {duration: 3000});
          }
        }
      });
    }
  }

  register() {
    const val = this.registerForm.value;

    if (val.username && val.newPassword && (val.email || val.phone)) {
      this.authService.register({
        username: val.username,
        password: val.newPassword,
        email: val.email,
        phone: val.phone
      }).subscribe({
          next: () => {
            this.switchLogin();
          },
          error(err: HttpErrorResponse) {
            console.log(err);
          }
        }
      );
    }
  }

  switchLogin() {
    this.isLogin = !this.isLogin;
  }
}
