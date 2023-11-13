import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent {

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
  }

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  login() {
    const val = this.loginForm.value;

    if (val.email && val.password) {
      this.authService.login({email:val.email, password: val.password}).subscribe({
        next: (response) => {
          console.log(response);
          this.authService.setToken(response.token);
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }
}
