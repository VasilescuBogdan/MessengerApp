import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LoginRequest} from "../dto/loginRequest.dto";
import {LoginResponse} from "../dto/loginResponse.dto";
import {RegisterRequest} from "../dto/registerRequest.dto";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  BASE_URL = 'http://localhost:8080/api/user/';

  constructor(private http: HttpClient) {
  }

  public login(loginRequest: LoginRequest) {
    return this.http.post<LoginResponse>(this.BASE_URL + 'signin', loginRequest, {headers: new HttpHeaders({"No-Auth": "True"})});
  }

  public setTokenAndUsername(jwtToken: string, username: string) {
    localStorage.setItem('jwtToken', jwtToken);
    localStorage.setItem('username', username);
  }

  public setUsername(username: string) {
    localStorage.setItem('username', username);
  }

  public getToken() {
    return localStorage.getItem('jwtToken') ?? '{}';
  }

  public getUsername() {
    return localStorage.getItem('username') ?? '{}';
  }

  public clear() {
    localStorage.clear();
  }

  public isLoggedIn() {
    return this.getToken() !== '{}';
  }

  public register(registerRequest: RegisterRequest) {
    return this.http.post(this.BASE_URL + 'signup', registerRequest, {headers: new HttpHeaders({"No-Auth": "True"})});
  }
}
