import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginRequest} from "../dto/loginRequest.dto";
import {LoginResponse} from "../dto/loginResponse.dto";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  BASE_URL = 'http://localhost:8080/api/user/';
  constructor(private http: HttpClient) { }

  login(loginRequest: LoginRequest) {
    return this.http.post<LoginResponse>(this.BASE_URL + 'signin', loginRequest);
  }

  setToken(jwtToken: string) {
    localStorage.setItem('jwtToken', jwtToken);
  }

  getToken() {
    return localStorage.getItem('jwtToken') || '{}';
  }

  public clear() {
    localStorage.clear();
  }

  public isLoggedIn() {
    return this.getToken() !== '{}';
  }

}
